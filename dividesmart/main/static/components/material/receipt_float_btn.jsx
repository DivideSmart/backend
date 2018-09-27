import 'regenerator-runtime/runtime'
import '../../style/index.less'

import {ActionSheet, Button, Toast, WhiteSpace, WingBlank} from 'antd-mobile'

import CameraAlt from '@material-ui/icons/CameraAlt';
import MButton from '@material-ui/core/Button';
import React from 'react'
// import axios from 'axios'
// import { getCookie } from 'util.js'
import { withStyles } from '@material-ui/core/styles';

let wrapProps;
const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    // width: 500,
    position: 'relative',
    minHeight: 200,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});


class FlaoatingButton extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: 0,
      content: undefined,
    };

    this.handleChange = (event, value) => {
      this.setState({ value });
    };

    this.handleChangeIndex = index => {
      this.setState({ value: index });
    };

    this.onClick = () => {
        const BUTTONS = ['Take photo of receipt', 'Select photo of receipt', 'Cancel'];
        ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: BUTTONS.length - 1,
          maskClosable: true,
          wrapProps,
        },
        (buttonIndex) => {
          if (buttonIndex == 1)
            this.finput.click()
        });
    }

    this.handleFiles = () => {
      const file = this.finput.files[0]
      props.addPhoto(file)
      this.finput.files = []
      // console.log(file)
      // var data = new FormData()
      // data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
      // data.append('receipt', file)
      // axios.post('/api/ocr', data).then((response) => {
      //   this.setState({
      //     content: response.data.content
      //   })
      //   // console.log(response.data.content)
      //   props.updateReceipt(response.data.content)
      //
      //   var lines = []
      //   for (var line of response.data.content.split('\n')) {
      //     if (line.match(/\d+\.\d+/g) && parseFloat(line.match(/\d+\.\d+/g)[0]) != 0) {
      //       lines.push(line)
      //       console.log(line)
      //     }
      //   }
      // })
    }
  }


  render() {
    const { classes, theme } = this.props;
    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };

    return (
      <div>
        <input
          ref={item => this.finput = item}
          style={{ visibility: 'hidden' }}
          type={'file'}
          accept="image/gif,image/jpeg,image/jpg,image/png"
          onChange={async () => this.handleFiles()}>
        </input>

        <MButton
          variant="fab"
          className={classes.fab + ' scan-receipt-btn'}
          style={{position: 'fixed', bottom: 60, zIndex: 1000}}
          onClick={this.onClick}
        >
          <CameraAlt style={{ color: 'white' }} />
        </MButton>
        {/* <p style={{ whiteSpace: 'pre' }}>{this.state.content}</p> */}
      </div>
    );
  }
}

// FlaoatingButton.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired,
// };

export default withStyles(styles, { withTheme: true })(FlaoatingButton);

