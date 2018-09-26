import '../../style/user_tab.less'

import { Badge, Result, Checkbox, Icon, List, WhiteSpace, WingBlank } from 'antd-mobile';
import Close from '@material-ui/icons/Close';
import Done from '@material-ui/icons/Done';
import IconButton from '@material-ui/core/IconButton';
import { MySnackbarContentWrapper } from '../alert_message.jsx'
import QRCode from 'qrcode.react'
import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios'
const Item = List.Item


class UserTab extends React.Component {
  constructor(props) {
    super()
    this.state = {
      myName: '',
      myEmailAddress: '',
      myAvatarUrl: '',
      pendingRequests: [],
      sentRequests: [],
      open: false,
      successMessage: '',
      totalDebt: 0
    };
    this.acceptRequest = this.acceptRequest.bind(this)
    this.rejectRequest = this.rejectRequest.bind(this)
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
          sentRequests: response.data.invites.sent,
          totalDebt: response.data.friends.map(f => parseFloat((Math.round(f.debt * 100) / 100).toFixed(2))).reduce((d1, d2) => d1  + d2, 0)
        })
      })
    })
  }

  acceptRequest(request) {
    const payload = {
      friendEmail: request.emailAddress,
    }
    axios.post('/api/user/friends/', payload).then((response, err) => {
      if(err) {
        throw err
      } else {
        this.setState({
          pendingRequests: this.state.pendingRequests.filter(r => {
            return r.emailAddress !== request.emailAddress;
          }),
          open: true,
          successMessage: 'Accepted request'
        })
      }
    })
  }

  rejectRequest(request) {
    axios.delete('/api/user/friends/{0}/'.format(request.id)).then((response, err) => {
      if(err) {
        throw err
      } else {
        this.setState({
          pendingRequests: this.state.pendingRequests.filter(r => {
            return r.emailAddress !== request.emailAddress;
          }),
          open: true,
          successMessage: 'Rejected request'
        })
      }
    })
  }

  render() {
    return (
      <div>
        <WhiteSpace />
        <WhiteSpace />

        <List>
          <Item extra={<span className={this.state.totalDebt >= 0 ? 'other-owe-amount' : 'owe-other-amount'}>{'${0}'.format(Math.abs(this.state.totalDebt))}</span>}>
            <Badge>
              <span
                id="photo"
                style={{
                  background: 'url(' + this.state.myAvatarUrl + ') center center /  60px 60px no-repeat'
                }}
              />
            </Badge>
            <span className="text-margin">{this.state.myName}</span>
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

          <Item extra={this.state.myEmailAddress} className={'user-email'}>
            <Badge text={0}>Email address</Badge>
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


        <WhiteSpace />


        <List renderHeader={() => 'Pending Received Requests'} className="email-list">
          {
            this.state.pendingRequests.length == 0 ?
            <Result
              className={'no-pending-request'}
              img={<Icon type="check-circle" style={{ fill: '#1F90E6', width: 28, height: 28 }} />}
              message="No pending received request!"
            /> :
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

                  <IconButton
                    onClick={(e) => this.rejectRequest(request)}
                  >
                    <Close />
                  </IconButton>

                  <span style={{marginLeft: 18}}>
                    {request.username}
                  </span>
                </Item>
              )
            })
          }
        </List>

        <WhiteSpace />

        <List renderHeader={() => 'Pending Sent requests'} className="email-list">
          {
            this.state.sentRequests.length == 0 ?
            <Result
              className={'no-pending-request'}
              img={<Icon type="check-circle" style={{ fill: '#1F90E6', width: 28, height: 28 }} />}
              message="No pending sent request!"
            /> :
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
            message={this.state.successMessage}
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

