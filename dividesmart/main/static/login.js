import 'regenerator-runtime/runtime'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'
import 'util.js'

import { Button, Icon, LocaleProvider, NavBar, WhiteSpace } from 'antd-mobile';
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider, connect } from 'react-redux';
import { dom, library } from '@fortawesome/fontawesome-svg-core'
import {
  faFacebook,
  faGoogle
} from '@fortawesome/free-brands-svg-icons'
import {
  faHandHoldingUsd,
  faHome,
  faLandmark,
  faMoneyBillAlt,
  faPenNib,
  faReceipt,
  faUserCircle,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { logoutUser, setCurrentUser } from './redux/actions/authActions.js';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MButton from '@material-ui/core/Button';
import React from 'react'
import ReactDOM from 'react-dom'
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import store from './redux/store';

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
      var apiBaseUrl = "/api";
      var payload={
        "email_address": this.state.username,
        "password": this.state.password
      }

      const self = this
      axios.post(apiBaseUrl + '/login/', payload)
      .then(function (response) {
        if (response.status == 200){
          window.location.replace("http://localhost:8000/");
        }
      })
      .catch(function (error) {
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

        <Card style={{marginLeft: '8vw', marginRight: '8vw', paddingBottom: '8vh' }}>
        <div style={{height: '12vh'}}>

        </div>

        <div style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <MButton
            // onClick = {() => this.setState({ showSettleUpModal: true })}
            variant="contained" size="small"
            style={{ width: '66%', height: '48px', backgroundColor:'#DD4B39', borderColor:'#DD4B39' }}
          >
            <FontAwesomeIcon icon={['fab', 'google']} style={{ color: 'white', height: 28, width: 28, marginRight: 28}}/>
            <span style={{color: 'white', fontSize: 13, fontWeight: 400, paddingTop: 2, textTransform: 'none'}}>Log in with Google</span>
          </MButton>
        </div>


        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />

        <div style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <MButton
            // onClick = {() => this.setState({ showSettleUpModal: true })}
            variant="contained" color="primary" size="small"
            style={{ width: '66%', height: '48px', backgroundColor:'#3b5998', borderColor:'#3b5998' }}
            onClick={this.facebookLogin}
          >
            <FontAwesomeIcon icon={['fab', 'facebook']} style={{ color: 'white', height: 28, width: 28, marginRight: 28}}/>
            <span style={{fontSize: 13, fontWeight: 400, paddingTop: 2, textTransform: 'none'}}>Log in with Facebook</span>
          </MButton>
        </div>

        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />




        <div style={{ textAlign: 'center'}}>
          <TextField
            style={{width: '69%'}}
            label="Username"
            value={this.state.username}
            onChange = {(event) => {
              this.setState({username: event.target.value})
            }}
          />
          <WhiteSpace size="lg" />
          <TextField
            style={{width: '69%'}}
            type="password"
            label="Password"
            value={this.state.password}
            onChange = {(event) => this.setState({ password: event.target.value })}
          />
        </div>

        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />

        <div style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <MButton
            onClick={(event) => this.clickLogin()}
            variant="outlined" color="primary" size="small"
            style={{ width: '66%', height: '6vh' }}
          >
            <Icon type={'check-circle-o'} style={{ height: 28, marginRight: 8}}/>
            <span style={{fontSize: 13, fontWeight: 400, paddingTop: 2, textTransform: 'none'}}>Log in</span>
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
