import 'regenerator-runtime/runtime'
import './css/index.css'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'

import React, { Component } from 'react'

import { TopBar } from './components/topbar.jsx'
import { LocaleProvider } from 'antd-mobile';
import ReactDOM from 'react-dom'
import { UserTab } from './components/tabs/user_tab.jsx'
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
        <TopBar />
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
