import 'regenerator-runtime/runtime'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'
import 'util.js'

import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { LocaleProvider, NavBar, Icon, WhiteSpace } from 'antd-mobile';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider, connect } from 'react-redux';
import { logoutUser, setCurrentUser } from './redux/actions/authActions.js';

import FormControl from '@material-ui/core/FormControl';
import MButton from '@material-ui/core/Button';
import React from 'react'
import ReactDOM from 'react-dom'
import TextField from '@material-ui/core/TextField';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import {
  faPenNib, faHandHoldingUsd, faMoneyBillAlt, faHome,
  faReceipt, faUserCircle, faUsers, faLandmark,
} from '@fortawesome/free-solid-svg-icons'

import {
  faFacebook, faGoogle
} from '@fortawesome/free-brands-svg-icons'


import axios from 'axios'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import store from './redux/store';

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
      token: ''
    };

    this.clickLogin = function() {
      var apiBaseUrl = "/api";
      var payload={
        "email_address": this.state.username,
        "password": this.state.password
      }

      console.log("payload")
      console.log(payload);

      axios.post(apiBaseUrl + '/login/', payload)
      .then(function (response) {
        console.log(response);
        if(response.status == 200){
          alert("Login successful");
          window.location.replace("http://localhost:8000/");
        }
        else if(response.status == 400){
          alert("username password do not match")
        }
        else{
          alert("Username does not exist");
        }
        })
      .catch(function (error) {
        console.log(error);
      });
    }

  }


  render() {
    return (
      <div>

        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />

        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />

        <div style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <MButton
            // onClick = {() => this.setState({ showSettleUpModal: true })}
            variant="contained" size="small"
            style={{ width: '66%', height: '6vh', backgroundColor:'#DD4B39', borderColor:'#DD4B39' }}
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
            style={{ width: '66%', height: '6vh', backgroundColor:'#3b5998', borderColor:'#3b5998' }}
          >
            <FontAwesomeIcon icon={['fab', 'facebook']} style={{ color: 'white', height: 28, width: 28, marginRight: 28}}/>
            <span style={{fontSize: 13, fontWeight: 400, paddingTop: 2, textTransform: 'none'}}>Log in with Facebook</span>
            </MButton>
        </div>

        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />




        <div style={{ textAlign: 'center'}}>
          <TextField
            label="Username"
            value={this.state.username}
            onChange = {(event) => {
              console.log(event.target.value)
              this.setState({username: event.target.value})
            }}
          />
          <WhiteSpace size="lg" />
          <TextField
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

      </div>


      // <div>
      //   <div style={{ height: '6vh', position: 'fixed', width: '100%', zIndex: 1000 }}>
      //     <NavBar
      //       style={{height: '100%'}}
      //       mode="light"
      //     >
      //       Name of the Appp
      //     </NavBar>
      //   </div>
      //   <TextField style={{ marginLeft: '45%', marginTop: '15%'}}
      //     label="Username"
      //     onChange = {(event) => { console.log(event.target.value)
      //     this.setState({username: event.target.value})}}
      //   />
      //   <br></br>
      //   <TextField style={{ marginLeft: '45%', marginTop: '2%'}}
      //     type="password"
      //     label="Password"
      //     onChange = {(event) => this.setState({ password: event.target.value })}
      //   />
      //   <br></br>
      //   <Button color="primary" style={{marginLeft: '48%', marginTop: 20}} onClick={(event) => this.handleClick(event, this.state.username, this.state.password)}>
      //   {'  '}Submit
      //   </Button>
      //   <br></br>
      //   <Button
      //     style={{ backgroundColor:'#DD4B39', borderColor:'#DD4B39', marginLeft: '45%', marginTop: '5%', color: 'white' }}
      //     className='login-form-button'
      //     id='google-login'
      //   >
      //   <i className='fa fa-google' aria-hidden='true'></i>
      //   {'  '}Log in with Google
      //   </Button>
      //   <br></br>
      //   <Button
      //     style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', marginLeft: '45%', marginTop: '2%' , color: 'white' }}
      //     className='login-form-button'
      //     id='facebook-login'
      //     onClick={this.facebookLogin}
      //     loading={this.state.fbLoginButtonLoading}
      //   >
      //   <i className='fa fa-facebook-official' aria-hidden='true'></i>
      //   {'  '}Log in with Facebook
      //   </Button>
      // </div>

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
