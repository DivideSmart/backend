import 'regenerator-runtime/runtime'
import './style/index.css'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'

import React, { Component } from 'react'

import { LocaleProvider } from 'antd-mobile';
import QrReader from 'react-qr-reader'
import ReactDOM from 'react-dom'
import enUS from 'antd-mobile/lib/locale-provider/en_US'

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
      window.location.href = data
    }
  }

  handleError(err){
    console.error(err)
  }

  render(){
    return(
      <div>
        <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '100%' }}
          />
        {/*<p>{this.state.result}</p>*/}
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
