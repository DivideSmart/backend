#!/usr/bin/env python

import cv2
import numpy as np
import argparse
from transform import *
from tesserocr import PyTessBaseAPI

# Just a helper function to help visualize image
def combine(_height, *args):
    result = ()

    for img in args:
        img = resize(img, _height)

        if len(img.shape) == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)

        result = result + (img,)

    result = np.hstack(result)

    return result

# Just a helper function to help visualize image
def show(img):
    return 1
    # cv2.imshow('Basic Image', img)
    # cv2.waitKey(0)

def resize(img, _size):
    ratio = float(_size) / img.shape[0]
    dim   = (int(img.shape[1] * ratio), _size)
    return cv2.resize(img, dim, interpolation = cv2.INTER_AREA)

def preprocess(img, clahe, noise_level):
    args = {'height': 300, 'closing': 3}
    # Getting the user input
    HEIGHT              = int(args['height'])
    CLOSING_SIZE        = int(args['closing'])
    bi = cv2.imread(img)

    original   = bi.copy()

    ratio      = original.shape[0] / float(HEIGHT)
    image = resize(original, HEIGHT)

    # Pad values to the border to better the findContour functions.
    image = cv2.copyMakeBorder(image, top=10, bottom=10, left=0, right=0, borderType= cv2.BORDER_CONSTANT, value=255)

    total_area = image.shape[0] * image.shape[1]

    def scan(clahe, noise_level):
        """ Step 1: Edge Detection """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) # get the grayscale image

        # Let use Clahe or Histogram equalization for color constrast
        # This will better the result of Edge Detection when the background have similar
        # color to the Receipt
        if(clahe == 1):
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
            gray = clahe.apply(gray)
        elif(clahe == 2):
            gray = cv2.equalizeHist(gray)
        gray = cv2.bilateralFilter(gray, 11, 17, 17)

        # automatic Canny edge detection thredhold computation
        high_thresh, thresh_im = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        low_thresh = high_thresh / 2.0

        edged = cv2.Canny(gray, low_thresh, high_thresh) # detect edges (outlines) of the objects

        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (CLOSING_SIZE, CLOSING_SIZE))
        closed = cv2.morphologyEx(edged, cv2.MORPH_CLOSE, kernel)

        """ Step 2: Finding Contours """
        (a, contours, b) = cv2.findContours(closed.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        total = 0
        # looping over the contours found
        approx_all = []
        for contour in contours:
            # approximating the contour
            contour = cv2.convexHull(contour)
            peri    = cv2.arcLength(contour, True)
            approx  = cv2.approxPolyDP(contour, 0.02 * peri, True)
            area    = cv2.contourArea(contour)

            # we don't consider anything less than 20% of the whole image
            if area < 0.2 * total_area:
                continue
            # if the approximated contour has 4 points, then assumer it is a receipt
            # a book is a receipt and thus it has 4 vertices
            if len(approx) == 4:
                cv2.drawContours(image, [approx], -1, (0, 255, 0), 4)
                approx_all.append(approx)
                total += 1

        print ('Found %d receipts in the image.' % total)

        if total != 0:
            """ Displaying all intermediate steps into one image """
            top_row = combine(300, original, gray)
            bot_row = combine(300, closed, image)
            show(top_row)
            show(bot_row)

            """ Step 3: Apply a Perspective and Threshold """
            total = 0
            for approx in approx_all:
                total += 1

                # This is to perform perspective Transformation, to transform a receipt bounding box
                # into a new image
                warped = Transform.get_box_transform(original, approx.reshape(4, 2) * ratio)

                scan_warped = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)

                # The higher the parameter of medianBlur, the less noisy but text will get blurred
                # Need to tune a bit.
                scan_warped = cv2.medianBlur(np.array(scan_warped), noise_level)
                scan_warped = cv2.adaptiveThreshold(scan_warped, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

                # save the image
                filename_color = './results/scan%03d_color.jpg' % total
                filename_scan  = './results/scan%03d_scan.jpg' % total
                cv2.imwrite(filename_color, warped)
                cv2.imwrite(filename_scan, scan_warped)
                show(scan_warped)

                with PyTessBaseAPI() as api:
                    api.SetImageFile(filename_scan)
                    return api.GetUTF8Text(), np.mean(np.array(api.AllWordConfidences()))
                # Without these steps of pre-processing (especially the findContour part),
                # the return result of pytesseract is empty.

        # The "else" case is when cannot detect any receipt, now used for debugging only
        else:
                print("ELSE CASE")
                top_row = combine(300, original, gray)
                bot_row = combine(300, closed, image)
                show(top_row)
                show(bot_row)
                scan_warped = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)

                scan_warped = cv2.medianBlur(np.array(scan_warped), noise_level)
                scan_warped = cv2.adaptiveThreshold(scan_warped, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
                # save the image
                filename_color = './results/scan%03d_color.jpg' % total
                filename_scan  = './results/scan%03d_scan.jpg' % total
                cv2.imwrite(filename_scan, scan_warped)
                show(scan_warped)
                with PyTessBaseAPI() as api:
                    api.SetImageFile(filename_scan)
                    return api.GetUTF8Text(), np.mean(np.array(api.AllWordConfidences()))

        return total

    return scan(clahe, noise_level)

def choose_best_preprocess(img):
    final_content = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    final_confidence = 0
    for i in [0, 1, 2]:
        for j in [1, 3, 5, 7, 9]:
            content, conf = preprocess(img, i, j)

            # Have to check whether the content is empty or not, because
            # it may not be able to detect anything but still return a very high confidence level.
            if(conf > final_confidence and len(content) > 0.8 * len(final_content)):
                print("BEST")
                print(conf)
                print(content)
                final_confidence = conf
                final_content = content
    return final_content, final_confidence

result, confidence = choose_best_preprocess('./img/example1.jpg')
print(result)
print(confidence)
