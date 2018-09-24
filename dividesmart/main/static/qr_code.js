import { Badge, List, WhiteSpace, WingBlank } from 'antd-mobile';
const Item = List.Item
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import Home from '@material-ui/icons/Home'
import { Icon, NavBar } from 'antd-mobile'
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux';
import store from './redux/store';
import { LocaleProvider } from 'antd-mobile';
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import QRCode from 'qrcode.react'

class Code extends React.Component {
  constructor(props) {
    super()
    this.state = {
      user: {},
      userID: '',
    };  
  }

  componentWillMount() {
    axios.get('/api/user').then(response => {
      this.setState({
        user: response.data,
        userID: response.data.id
      })
    })
  }

  render() {
    return (
      <QRCode style={{display: 'flex', justifyContent: 'center', marginLeft: '27.5%', marginTop: '5%'}}
        value={this.state.userID} //API request --> something like api/addnewfriend?userId=xxxx
        size={512}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
      />
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
                  style={{width: '28px', height: '28px', color: 'black'}}
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
    <Code />
  </LocaleProvider>,
  document.getElementById('qr-code')
)