# WeShare

----
[WeShare](https://weshare.gq)
 is an application that allows users to keep track of their debts, payments, and bills. It helps people split expenses among their friends by creating groups and making payments among them.

Accessible at [https://weshare.gq](https://weshare.gq)

## Made by:

* **Edmund Mok**

  *Matriculation number:* A0093960X
  
  * Designed database schema and models
  * Designed and wrote API routes supporting all the features available in the app
    * Register, Login, Logout
    * Send, Accept, Delete friend requests
    * Create, Get group, Add group members
    * Add, Get, Edit, Delete bill
    * Add, Get, Edit, Delete payment
    * Get friend and aggregated debt with friend
  * Wrote API documentation (https://weshare2.docs.apiary.io/)

* **Le Trung Hieu:**
   
   *Matriculation number:* A0161308M
   
   Hook up various front-end parts to back-end, do the group feature where people can create group, view group bill history,etc. Made the OCR scan engine with different pre-processing and achieve good accuracy, but not integrated in the app yet. I also made periodic fixes and enhancements to the backend.

* **Sreyans Sipani:**

   *Matriculation number:* A0177059U

   Worked mainly on the front-end, CSS styling and features such as friend requests, alert messages, and connected other features with the backend. I also made periodic fixes and enhancements to the backend.

* Yuyang Luo

   *Matriculation number:* A0147980U

   * set up the whole project structure (including but not limited to writing webpack configuration files, deployment scripts, and project settings file).
   * Draw the App icon
   * implment the service worker
   * implement the following views:
     * login view (including login with Facebook and Google)
     * home view (friends list with debt summary)
     * friend detail view (including the settle up modal)
     * creating a new bill view
   * implement several components, including but not limited to the following:  
     * topbar with dropdown
     * tabbar with 3 tabs
     * fixed float button (creating-a-new-bill button and attach-img button)
    * periodic fixes and enhancements to the backend, including writing the User model and implement the Google and Facebook login backend logic.
