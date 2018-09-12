import 'regenerator-runtime/runtime'
import './css/index.css'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'

import {
  Link,
  Route,
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'

import FlaoatingButton from './components/material/material_float_btn.jsx'
import { LocaleProvider } from 'antd-mobile';
import React from 'react'
import ReactDOM from 'react-dom'
import { Tabs } from './components/tabs.jsx'
import { TopBar } from './components/topbar.jsx'
import axios from 'axios'
import enUS from 'antd-mobile/lib/locale-provider/en_US'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  componentDidMount() {
    axios.get('/').then(response => {
      console.log(response.data)
    })
  }

  render() {
    return (
      <Router basename={'/'}>
        <div>
          <TopBar />
          <Tabs />
          <FlaoatingButton />
        </div>
      </Router>
    )
  }
}

ReactDOM.render(
  <LocaleProvider locale={enUS}>
    <App />
  </LocaleProvider>,
  document.getElementById('main')
)
