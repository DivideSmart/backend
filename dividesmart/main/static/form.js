import 'regenerator-runtime/runtime'
import './css/index.css'
import 'typeface-roboto'

import React from 'react'
import ReactDOM from 'react-dom'

import { TopBar } from './components/topbar.jsx'
import FlaoatingButton from './components/material/material_float_btn.jsx'
import { Tabs } from './components/tabs.jsx'
import { CreateForm } from './components/create_form.jsx'
import 'antd-mobile/dist/antd-mobile.css'
import { LocaleProvider } from 'antd-mobile';
import enUS from 'antd-mobile/lib/locale-provider/en_US'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <TopBar />
        <CreateForm />
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
