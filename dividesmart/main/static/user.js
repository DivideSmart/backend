import 'regenerator-runtime/runtime'
import './css/index.css'
import 'typeface-roboto'

import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import ReactDOM from 'react-dom'

import 'antd-mobile/dist/antd-mobile.css'
import { CustomNavBar } from './components/navbar.jsx'
import { LocaleProvider, List, Badge } from 'antd-mobile';
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import { UserTab } from './components/user_tab.jsx'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render(){
    return(
      <div>
        <CustomNavBar />
        <UserTab />
      </div>
    )
  }
}

ReactDOM.render(
  <LocaleProvider locale={enUS}>
    <App />
  </LocaleProvider>,
  document.getElementById('main')
)
