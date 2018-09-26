import 'regenerator-runtime/runtime'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'
import 'util.js'
import './style/login.less'

import { Button, Icon, LocaleProvider, NavBar, WhiteSpace } from 'antd-mobile';
// import { CSSTransition, TransitionGroup } from "react-transition-group"
// import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider, connect } from 'react-redux';
import { dom, library } from '@fortawesome/fontawesome-svg-core'
import {
  faFacebook,
  faGoogle
} from '@fortawesome/free-brands-svg-icons'
import {
  // faHandHoldingUsd,
  // faHome,
  // faLandmark,
  // faMoneyBillAlt,
  // faPenNib,
  // faReceipt,
  // faUserCircle,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { logoutUser, setCurrentUser } from './redux/actions/authActions.js';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
// import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
// import Collapse from '@material-ui/core/Collapse';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import FormControl from '@material-ui/core/FormControl';
// import IconButton from '@material-ui/core/IconButton';
// import Input from '@material-ui/core/Input';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import InputLabel from '@material-ui/core/InputLabel';
import MButton from '@material-ui/core/Button';
import React from 'react'
import ReactDOM from 'react-dom'
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import store from './redux/store';
// import { getCookie } from 'util.js'
import Snackbar from '@material-ui/core/Snackbar';
import { MySnackbarContentWrapper } from './components/alert_message.jsx'

library.add(faFacebook, faGoogle, faUsers)

class LoginPage extends React.Component {

  constructor(props) {
    super()
    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'

    this.state = {
      isAuthenticated: false,
      username: '',
      password: '',
      token: '',
      errorMessage: false,
    }

    this.clickLogin = function() {
      const apiBaseUrl = "/api";
      const payload={
        "email_address": this.state.username,
        "password": this.state.password,
      }

      const self = this
      axios.post(apiBaseUrl + '/login/', payload)
      .then(function(response) {
        if (response.status == 200){
          window.location.replace('/');
        }
      })
      .catch(function(error) {
        console.log(error)
        self.setState({errorMessage: true})
      });
    }

    this.facebookLogin = () => {
      FB.login(function(response) {
        const payload = response.authResponse
        axios.post('/api/login/fb/', payload).then((response) => {
          window.location.href = '/'
        }).catch(e => {
          // TODO: notification
        })
      }, {scope: 'email'})  // TODO: get user' friends also
    }

    this.handleMessageClose = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }
      this.setState({ errorMessage: false })
    }
  }

  componentDidMount() {
    const self = this
    function loadFBSdk(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) return
      js = d.createElement(s); js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }
    loadFBSdk(document, 'script', 'facebook-jssdk')
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '749773275363427',  // TODO:
        cookie     : true,
        xfbml      : true,
        version    : 'v3.0'
      })
      FB.AppEvents.logPageView()
      self.setState({fbLoginButtonLoading: false})
    }


    // var auth2 = undefined
    // function attachSignin(element) {
    //   auth2.attachClickHandler(element, {},
    //     function(googleUser) {
    //       var data = new FormData()
    //       data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
    //       data.append('id_token', googleUser.getAuthResponse().id_token)
    //       axios.post('/api/signin/google', data).then((response) => {
    //         window.location.href = '/'
    //       }).catch(e => {
    //         notification['warning']({
    //           message: e.response == undefined ? '' : e.response.data,
    //           duration: 1.8,
    //         })
    //       })
    //     }, function(error) {
    //       console.log(JSON.stringify(error, undefined, 2))
    //     }
    //   )
    // }
    // gapi.load('auth2', function(){
    //   auth2 = gapi.auth2.init({
    //     client_id: 'some value',  // TODO:
    //     cookiepolicy: 'single_host_origin',
    //   })
    //   attachSignin(document.getElementById('google-login'))
    // })
  }


  render() {
    return (
      <div>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />

        <Card id="login-card">

        <div className="social">
          <MButton
            // onClick = {() => this.setState({ showSettleUpModal: true })}
            variant="contained" size="small"
            id="google-button"
            className="social-button"
          >
            <FontAwesomeIcon icon={['fab', 'google']} className="social-icon" />
            <span className="social-text">Log in with Google</span>
          </MButton>
        </div>


        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />

        <div className="social">
          <MButton
            // onClick = {() => this.setState({ showSettleUpModal: true })}
            variant="contained" color="primary" size="small"
            id="facebook-button"
            className="social-button"
            onClick={this.facebookLogin}
          >
            <FontAwesomeIcon icon={['fab', 'facebook']} className="social-icon"/>
            <span className="social-text">Log in with Facebook</span>
          </MButton>
        </div>

        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />




        <div style={{ textAlign: 'center'}}>
          <TextField
            className="input-width"
            label="Username"
            value={this.state.username}
            onChange = {(event) => {
              this.setState({username: event.target.value})
            }}
          />
          <WhiteSpace size="lg" />
          <TextField
            className="input-width"
            type="password"
            label="Password"
            value={this.state.password}
            onChange = {(event) => this.setState({ password: event.target.value })}
          />
        </div>

        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />

        <div className="social">
          <MButton
            onClick={(event) => this.clickLogin()}
            variant="outlined" color="primary" size="small"
            className="social-button"
          >
            <Icon type={'check-circle-o'} className="social-icon" style={{ color: '#3b5998', marginRight: 8 }}/>
            <span className="social-text" style={{color: '#3b5998'}}>Log in</span>
          </MButton>
        </div>
        </Card>


        <Snackbar anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={this.state.errorMessage}
          autoHideDuration={3800}
          onClose={this.handleMessageClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleMessageClose}
            variant="warning"
            message="email or password incorrect"
          />
        </Snackbar>
      </div>
    )
  }
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0060c0',
    },
    secondary: {
      main: '#0060c0',
    }
  },
  // status: {
  //   danger: 'orange',
  // },
})


const mapStoreToProps = (store, ownProps) => {
  return {...ownProps, user: store.user}
}
const LoginPageWithRedux = connect(mapStoreToProps, {setCurrentUser})(LoginPage)

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={enUS}>
      <MuiThemeProvider theme={theme}>
        <LoginPageWithRedux />
      </MuiThemeProvider>
    </LocaleProvider>
  </Provider>,
  document.getElementById('main')
)
