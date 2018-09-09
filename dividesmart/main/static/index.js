import 'regenerator-runtime/runtime'
import './css/index.css'
import 'typeface-roboto'

import React from 'react'
import ReactDOM from 'react-dom'

import { CustomNavBar } from './components/navbar.jsx'
import FlaoatingButton from './components/material/material_float_btn.jsx'
import { TabBarExample } from './components/tabs.jsx'
import 'antd-mobile/dist/antd-mobile.css'
import { LocaleProvider } from 'antd-mobile';
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import axios from 'axios'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  componentDidMount() {
    axios.get('/api/get_debts_list').then((response) => {
      console.log(response.data)
    })
  }

  render() {
    return (
      <div>
        <CustomNavBar />
        <TabBarExample />
        <FlaoatingButton />
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
