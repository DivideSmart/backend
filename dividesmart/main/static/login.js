import 'regenerator-runtime/runtime'
import './style/index.css'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'
import 'util.js'
import loginStyles from './login.css'

import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux';
import { faChevronLeft, faDollarSign, faHome, faReceipt, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons'
import { logoutUser, setCurrentUser } from './redux/actions/authActions.js';

import { LocaleProvider } from 'antd-mobile';
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import { library } from '@fortawesome/fontawesome-svg-core'
import store from './redux/store';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { LinearGradient } from 'expo';

library.add([faDollarSign, faReceipt, faHome, faChevronLeft, faUsers, faUserCircle])


class LoginPage extends React.Component {

  constructor(props) {
      super();
      this.state = { isAuthenticated: false, user: null, token: ''};
  }

  logout = () => {
      this.setState({isAuthenticated: false, token: '', user: null})
  };

  facebookResponse = (response) => {
      const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
      const options = {
          method: 'POST',
          body: tokenBlob,
          mode: 'cors',
          cache: 'default'
      };
      fetch('http://localhost:8000/api/auth/facebook', options).then(r => {
          const token = r.headers.get('x-auth-token');
          r.json().then(user => {
              if (token) {
                  this.setState({isAuthenticated: true, user, token})
              }
          });
      })
      response.setHeader('x-auth-token', response.accessToken);
  };

  googleResponse = (response) => {
      const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
      const options = {
          method: 'POST',
          body: tokenBlob,
          mode: 'cors',
          cache: 'default'
      };
      fetch('http://localhost:8000/api/v1/auth/google', options).then(r => {
          const token = r.headers.get('x-auth-token');
          r.json().then(user => {
              if (token) {
                  this.setState({isAuthenticated: true, user, token})
              }
          });
      })
  };

  onFailure = (error) => {
    alert(error);
  }

  render() {
    return (
          <div className={loginStyles.login}>
            <Button
              style={{ backgroundColor:'#DD4B39', borderColor:'#DD4B39', marginLeft: 600, marginTop: 300, color: 'white' }}
              className='login-form-button'
              htmlType='button'
              id='google-login'
            >
              <i className='fa fa-google' aria-hidden='true'></i>
              {'  '}Log in with Google
            </Button>
            <br></br>
            <Button
              style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', marginLeft: 600, marginTop: 16 , color: 'white' }}
              className='login-form-button'
              htmlType='button'
              id='facebook-login'
              onClick={this.facebookLogin}
              loading={this.state.fbLoginButtonLoading}
            >
              <i className='fa fa-facebook-official' aria-hidden='true'></i>
              {'  '}Log in with Facebook
            </Button>
          </div>
        </LinearGradient>
      </View>
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
