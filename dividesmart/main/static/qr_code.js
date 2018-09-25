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
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import './style/index.less'

class Code extends React.Component {
  
  constructor(props) {
    super()
    this.state = {
      user: {emailAddress: 'test@test.com'},
      userID: '',
      width: 0,
      height: 0
    };  
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentWillMount() {
    axios.get('/api/user').then(response => {
      console.log(response)
      this.setState({
        user: response.data
      })
    })
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  render() {
    return (
      <div>
        <QRCode
          value={this.state.user.emailAddress} //API request --> something like api/addnewfriend?userId=xxxx
          size={this.state.width < this.state.height ? this.state.width : this.state.height}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
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
                  style={{width: '28px', height: '28px', color: 'black'}}
                />
              </Link>
            }
            mode="light"
            >
            WeShare
          </NavBar>
          <br/>
          <Typography variant="headline" gutterBottom style={{textAlign: 'center'}}>
            Scan your QR Code to let friends add you!
          </Typography>
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