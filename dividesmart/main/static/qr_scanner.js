import 'regenerator-runtime/runtime'
import './style/index.less'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import React, { Component } from 'react'
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux';
import store from './redux/store';
import Home from '@material-ui/icons/Home'
import { Icon, NavBar, Popover } from 'antd-mobile'
import axios from 'axios'

import { LocaleProvider } from 'antd-mobile';
import QrReader from 'react-qr-reader'
import ReactDOM from 'react-dom'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import { TopBar } from './components/topbar.jsx'
import { Tabs } from './components/tabs.jsx'
import Snackbar from '@material-ui/core/Snackbar';
import { MySnackbarContentWrapper } from './components/alert_message.jsx'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 80,
      result: 'No result',
      open: false
    }
    this.handleScan = this.handleScan.bind(this)
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  handleScan(data) {
    if(data !== null) {
      console.log("Data: " + data)
      var payload={
        "friendEmail": data,
      }
      axios.post('http://localhost:8000/api/user/friends/', payload)
      .then((res, err) => {
        if(err) {
          console.log(err)
        } else {
          console.log(res)
          this.setState({ 
            result: data,
            open: true
          })
        }
      })
    }
  }

  handleError(err){
    console.error(err)
  }

  render() {
    return(
      <div>
        <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
        />
        <br/>
        <Typography variant="headline" gutterBottom style={{textAlign: 'center'}}>
          Scan your friend's QR Code to add them!
        </Typography>
        <Snackbar anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant="success"
            message="Sending Request!"
          />
        </Snackbar>

      </div>
    )
  }
}


ReactDOM.render(
  <Provider store={store}>
    <Router basename={''}>
      <Route render={({ location }) => (
        <div style={{ height: '6vh', position: 'fixed', width: '100%', zIndex: 1000 }}>
          <NavBar
            style={{height: '100%'}}
            icon={
              <Link className='topbar-btn' onClick={() => {window.location.href='/';}} to='/'>
                <Home
                  style={{width: '28px', height: '28px',}}
                />
              </Link>
            }
            mode="light"
            >
            WeShare
          </NavBar>
        </div>
      )} />
    </Router>
  </Provider>,
  document.getElementById('topbar')
)

ReactDOM.render(
  <LocaleProvider locale={enUS}>
    <App />
  </LocaleProvider>,
  document.getElementById('qr-scanner')
)