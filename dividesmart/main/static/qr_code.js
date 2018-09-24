import { Badge, List, WhiteSpace, WingBlank } from 'antd-mobile';
const Item = List.Item
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import { LocaleProvider } from 'antd-mobile';
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import QRCode from 'qrcode.react'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { TopBar } from './components/topbar.jsx'
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'

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
      <Router basename={''}>
        <Route render={({ location }) => (
          <div>
            <TopBar />
            <QRCode style={{display: 'flex', justifyContent: 'center', marginLeft: '30%', marginTop: 10}}
              value={this.state.userID} //API request --> something like api/addnewfriend?userId=xxxx
              size={512}
              bgColor={"#ffffff"}
              fgColor={"#00bfff"}
              level={"L"}
            />
        {/* <WhiteSpace />
        <WhiteSpace />
        <WingBlank>
          <Button>Create Debt</Button>
        </WingBlank> */}
          </div>
        )} />
      </Router>
    )
  }
}

ReactDOM.render(
  <LocaleProvider locale={enUS}>
    <Code />
  </LocaleProvider>,
  document.getElementById('main')
)