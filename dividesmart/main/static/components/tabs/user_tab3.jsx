import { Badge, List, WhiteSpace, WingBlank, Checkbox } from 'antd-mobile';
import IconButton from '@material-ui/core/IconButton';
const Item = List.Item
import axios from 'axios'
import React from 'react'
import QRCode from 'qrcode.react'
import Done from '@material-ui/icons/Done';
import Snackbar from '@material-ui/core/Snackbar';
import { MySnackbarContentWrapper } from '../alert_message.jsx'


class UserTab extends React.Component {
  constructor(props) {
    super()
    this.state = {
      myName: '',
      myEmailAddress: '',
      myAvatarUrl: '',
      pendingRequests: [],
      sentRequests: [],
      open: false
    };  
    this.acceptRequest = this.acceptRequest.bind(this)
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  componentWillMount() {
    axios.get('/api/user/').then(response => {
      this.setState({
        myName: response.data.username,
        myEmailAddress: response.data.emailAddress,
        myAvatarUrl: response.data.avatarUrl
      })
      axios.get('/api/user/friends/').then(response => {
        this.setState({
          pendingRequests: response.data.invites.received,
          sentRequests: response.data.invites.sent
        })
      })
    })
  }

  acceptRequest(request) {
    var payload = {
      friendEmail: request.emailAddress,
    }
    axios.post('/api/user/friends/', payload).then((response, err) => {
      if(err) {
        throw err
      } else {
        console.log(request);
        this.setState({
          pendingRequests: this.state.pendingRequests.filter(r => {
            console.log(r);
            return r.emailAddress !== request.emailAddress;
          }),
          open: true
        })
      }
    })
  }

  render() {
    return (
      <div>
        <List>
          <Item extra="extra content">
            <Badge>
              <span
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'url(' + this.state.myAvatarUrl + ') center center /  60px 60px no-repeat',
                  display: 'inline-block' }}
              />
            </Badge>
            <span style={{ marginLeft: 12 }}>{this.state.myName}</span>
          </Item>
          {/* <Item
            thumb="https://zos.alipayobjects.com/rmsportal/faMhXAxhCzLvveJ.png"
            extra={<Badge text={77} overflowCount={55} />}
            arrow="horizontal"
          >
            Content
          </Item>
          <Item><Badge text={'促'} corner>
            <div className="corner-badge">Use corner prop</div>
          </Badge></Item>
          <Item className="special-badge" extra={<Badge text={'促'} />}>
            Custom corner
          </Item> */}

          <Item extra={this.state.myEmailAddress}>
            <Badge text={0} style={{ marginLeft: 12 }}>Email address</Badge>
            {/* <Badge text={'new'} style={{ marginLeft: 12 }} /> */}
          </Item>
          {/* <Item>
            Marketing:
            <Badge text="减" hot style={{ marginLeft: 12 }} />
            <Badge text="惠" hot style={{ marginLeft: 12 }} />
            <Badge text="免" hot style={{ marginLeft: 12 }} />
            <Badge text="反" hot style={{ marginLeft: 12 }} />
            <Badge text="HOT" hot style={{ marginLeft: 12 }} />
          </Item>
          <Item>
            Customize
            <Badge text="券" style={{ marginLeft: 12, padding: '0 3px', backgroundColor: '#f19736', borderRadius: 2 }} />
            <Badge text="NEW" style={{ marginLeft: 12, padding: '0 3px', backgroundColor: '#21b68a', borderRadius: 2 }} />
            <Badge text="自动缴费"
              style={{
                marginLeft: 12,
                padding: '0 3px',
                backgroundColor: '#fff',
                borderRadius: 2,
                color: '#f19736',
                border: '1px solid #f19736',
              }}
            />
          </Item> */}
        </List>
        <List renderHeader={() => 'Pending Requests'} className="email-list">
          { 
            this.state.pendingRequests.map(request => {
              return (
                <Item
                  key={request.id}
                >
                  <IconButton
                    onClick={(e) => this.acceptRequest(request)}
                  >
                    <Done />
                  </IconButton>
                  {request.username}
                </Item>
              )
            })
          }
        </List>
        <List renderHeader={() => 'Sent requests'} className="email-list">
          { 
            this.state.sentRequests.map(request => {
              return (
                <Item
                  key = {request.id}
                >
                  {request.username}
                </Item>
              )
            })
          }
        </List>
        <Snackbar anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant="success"
            message="Accepted request"
          />
        </Snackbar>
        {/* <WhiteSpace />
        <WhiteSpace />
        <WingBlank>
          <Button>Create Debt</Button>
        </WingBlank> */}
      </div>
    )
  }
}


export { UserTab }

