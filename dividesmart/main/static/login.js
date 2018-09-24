import 'regenerator-runtime/runtime'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'
import 'util.js'

import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux';
import { faChevronLeft, faDollarSign, faHome, faReceipt, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons'
import { logoutUser, setCurrentUser } from './redux/actions/authActions.js';

import { LocaleProvider, NavBar } from 'antd-mobile';
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import { library } from '@fortawesome/fontawesome-svg-core'
import store from './redux/store';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

library.add([faDollarSign, faReceipt, faHome, faChevronLeft, faUsers, faUserCircle])


class LoginPage extends React.Component {

  constructor(props) {
      super();
      this.state = { isAuthenticated: false, username: '', password: '', token: ''};
      redirectIfAuthenticated()
  }

  redirectIfAuthenticated() {
    console.log(store.getState().auth.user)
    if(store.getState().auth.user === undefined) {
      window.location.replace("http://localhost:8000/");
    }
  }

  handleClick(event, username, password) {
    var apiBaseUrl = "http://localhost:8000/api/";
    var self = this;
    var payload={
    "email_address": this.state.username,
    "password": this.state.password
    }

    console.log("payload")
    console.log(payload);
    axios.post(apiBaseUrl+'login/', payload)
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

  // updateUserN
  render() {
    return (
      <div>
        <div style={{ height: '6vh', position: 'fixed', width: '100%', zIndex: 1000 }}>
          <NavBar
            style={{height: '100%'}}
            mode="light"
          >
            Name of the Appp
          </NavBar>
        </div>
        <TextField style={{ marginLeft: '45%', marginTop: '10%'}}
           hintText="Enter your Username"
           floatingLabelText="Username"
           label="Username"
           onChange = {(event) => { console.log(event.target.value)
             this.setState({username: event.target.value})}}
        />
        <br></br>
        <TextField style={{ marginLeft: '45%', marginTop: '2%'}}
           type="password"
           label="Password"
           onChange = {(event) => this.setState({ password: event.target.value })}
        />
        <br></br>
        <Button primary style={{marginLeft: '48%', marginTop: 20}} onClick={(event) => this.handleClick(event, this.state.username, this.state.password)}>
        {'  '}Submit
        </Button>
        <br></br>
        <Button
          style={{ backgroundColor:'#DD4B39', borderColor:'#DD4B39', marginLeft: '45%', marginTop: '5%', color: 'white' }}
          className='login-form-button'
          id='google-login'
        >
        <i className='fa fa-google' aria-hidden='true'></i>
        {'  '}Log in with Google
        </Button>
        <br></br>
        <Button
          style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', marginLeft: '45%', marginTop: '2%' , color: 'white' }}
          className='login-form-button'
          id='facebook-login'
          onClick={this.facebookLogin}
          loading={this.state.fbLoginButtonLoading}
        >
        <i className='fa fa-facebook-official' aria-hidden='true'></i>
        {'  '}Log in with Facebook
        </Button>
      </div>
      //   </MuiThemeProvider>
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
