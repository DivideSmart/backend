import 'regenerator-runtime/runtime'
import './css/index.css'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'

import { Badge, List, LocaleProvider } from 'antd-mobile';
import React, { Component } from 'react'

import { CustomNavBar } from './components/navbar.jsx'
import QrReader from 'react-qr-reader'
import ReactDOM from 'react-dom'
import { UserTab } from './components/user_tab2.jsx'
import enUS from 'antd-mobile/lib/locale-provider/en_US'

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
