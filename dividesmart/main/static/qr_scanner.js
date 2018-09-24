import 'regenerator-runtime/runtime'
import './style/index.less'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'

import React, { Component } from 'react'
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux';
import store from './redux/store';
import Home from '@material-ui/icons/Home'
import { Icon, NavBar, Popover } from 'antd-mobile'

import { LocaleProvider } from 'antd-mobile';
import QrReader from 'react-qr-reader'
import ReactDOM from 'react-dom'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import { TopBar } from './components/topbar.jsx'
import { Tabs } from './components/tabs.jsx'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 80,
      result: 'No result',
    }
    this.handleScan = this.handleScan.bind(this)
  }

  handleScan(data) {
    if (data) {
      this.setState({
        result: data,
      })
      window.location.href = '/addfriend/' + data
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
            Name of the Appp
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