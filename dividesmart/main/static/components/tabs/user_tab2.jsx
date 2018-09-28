import {Badge, Button, Icon, List, Modal, Result, WhiteSpace, SwipeAction} from 'antd-mobile';
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MButton from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React from 'react'
import axios from 'axios'
import classNames from 'classnames';
import store from '../../redux/store.js'
import { withStyles } from '@material-ui/core/styles';

const Item = List.Item
const Brief = Item.Brief
const alert = Modal.alert;
const prompt = Modal.prompt


class UserTabWithoutStyle extends React.Component {
  constructor() {
    super()
    this.state = {
      showSettleUpModal: false,
      userInfo: {emailAddress: '', username: '', debt: '', color: 'other-owe-amount'},
      entries: [],
      friendId: '',
      current_user_id: '',
      payAmount: 0
    }
    this.postPayment = this.postPayment.bind(this);
  }

  componentDidMount() {
    this.setState({
      friendId: this.props.match.params.userPk,
      current_user_id: store.getState().auth.user.id
    })

    var friendId = this.props.match.params.userPk;

    axios.get('/api/user/friends/' + friendId + "/")
    .then(response => {
      var userInfo = {}
      userInfo.id = response.data.id;
      userInfo.emailAddress = response.data.emailAddress;
      userInfo.username = response.data.username;

      userInfo.debt = parseFloat(response.data.debt) > 0 ? response.data.debt : response.data.debt.slice(1);

      userInfo.avatarUrl = response.data.avatarUrl;
      userInfo.color = parseFloat(response.data.debt) > 0 ? 'other-owe-amount' : 'owe-other-amount'

      this.setState({
        userInfo: userInfo
      })

      axios.get('/api/user/friends/' + friendId + "/entries/")
      .then(response => {
        var current_user_id = store.getState().auth.user.id;
        var entries = []
        response.data.entries.forEach(entry => {

          var dateObj = new Date(entry.dateCreated);
          entry.dateFormat = (dateObj.getMonth() + 1).toString() + "/"
                              + dateObj.getDate().toString() + "/"
                              + dateObj.getFullYear().toString();
          if (entry.type == 'payment') {
            entry.color = 'payment-amount'
            entry.name = entry.initiator == current_user_id
                                ? 'you pay ' + this.state.userInfo.username
                                : this.state.userInfo.username + ' pay you'
          } else if (entry.type == 'bill') {
            entry.amount = entry.initiator == current_user_id
                                ? entry.loans[friendId]
                                : entry.loans[current_user_id]

            entry.color = entry.initiator == current_user_id
                                ? 'other-owe-amount'
                                : 'owe-other-amount'
          }

          entries.push(entry)
        })

        this.setState({
          entries: entries
        })
      })
    })
  }

  postPayment(amount) {
    const payload = {amount: amount}
    axios.post('/api/user/friends/' + this.props.match.params.userPk + "/payments/", payload)
         .then(response => {
            console.log(response);
          })
  }

  render() {

  const { classes } = this.props;

    return (
      <div>
        <WhiteSpace />
        <WhiteSpace />
        <List>
          <List.Item extra={
            <div>
              <MButton
                onClick = {() => this.setState({ showSettleUpModal: true })}
                variant="outlined" color="primary" size="small"
              >
                <Icon type={'check-circle-o'} style={{ height: 18, marginRight: 8}}/>
                <span style={{fontSize: 13, fontWeight: 400, paddingTop: 2, textTransform: 'none'}}>Settle Up</span>
              </MButton>
            </div>

          }>
            <Badge>
              <span
                style={{
                  width: '60px',
                  height: '60px',
                  margin: '6px 0px 0px 0px',
                  background: 'url(' + this.state.userInfo.avatarUrl + ') center center /  60px 60px no-repeat',
                  display: 'inline-block' }}
              />
            </Badge>
            <span style={{ marginLeft: 12 }}>{this.state.userInfo.username}</span>
          </List.Item>

          <Item
            // arrow="horizontal"
            // thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            // multipleLine
            extra={<span className={this.state.userInfo.color}>$ {this.state.userInfo.debt}</span>}
          >
            <Badge text={0} style={{ marginLeft: 12 }}>Summary</Badge>
          </Item>

          <List.Item extra={this.state.userInfo.emailAddress}
            // arrow="horizontal"
            className={'user-email'}
          >
            <Badge text={0} style={{ marginLeft: 12 }}>Email address</Badge>
            {/* <Badge text={'new'} style={{ marginLeft: 12 }} /> */}
          </List.Item>
        </List>

        <WhiteSpace />
        <List renderHeader={() => 'History with ' + this.state.userInfo.username} className="my-list">
          {/*<Item extra={'Debt'}>Date</Item>*/}
        </List>

        <List>
          {
            this.state.entries.map(entry => {
              return (
                <SwipeAction
                  style={{ backgroundColor: 'gray' }}
                  autoClose
                  right={[
                    {
                      text: 'Delete',
                      onPress: () => {
                        alert('Delete', 'Are you sure???', [
                          { text: 'Cancel'},
                          { text: 'Ok', onPress: () => {
                            axios.delete(entry.type == 'bill' ? '/api/bills/' + entry.id : '/api/user/friends/' + this.state.userInfo.id + '/payments/' + entry.id)
                              .then(() => {
                                const newEntries = this.state.entries.filter(e => e.id != entry.id)
                                this.setState({entries: newEntries})
                                axios.get('/api/user/friends/' + this.state.userInfo.id + "/")
                                  .then(response => {
                                    this.setState({
                                      userInfo: {
                                        ...this.state.userInfo,
                                        debt: parseFloat(response.data.debt) > 0 ? response.data.debt : response.data.debt.slice(1)
                                      }
                                    })
                                  })
                              })
                          }},
                        ])
                      },
                      style: { backgroundColor: '#f39c12', color: 'white' },
                    }
                  ]}
                >
                  <Item
                    arrow="horizontal"
                    key={entry.id}
                    thumb={
                      <FontAwesomeIcon icon={entry.type == 'bill' ? 'receipt' : 'dollar-sign'} style={{ color: '#38b8f2', width: 24, height: 24}} />
                    }
                    multipleLine
                    onClick={() => {}}
                    extra={<span className={entry.color}>${entry.amount}</span>}
                    >
                      {entry.name} <Brief>{entry.dateFormat}</Brief>
                  </Item>
                </SwipeAction>
              )
            })
          }
        </List>

        <WhiteSpace />
        <WhiteSpace />
        <WhiteSpace />

        {/*<Button*/}
          {/*type="primary" icon="check-circle-o"*/}
          {/*// onClick={*/}
          {/*//   () => prompt('defaultValue', 'defaultValue for prompt',*/}
          {/*//     [*/}
          {/*//       { text: 'Cancel' },*/}
          {/*//       { text: 'Submit', onPress: value => console.log(`输入的内容:${value}`) },*/}
          {/*//     ], 'default', '100')*/}
          {/*// }*/}
          {/*onClick = {() => this.setState({ showSettleUpModal: true })}*/}
        {/*>*/}
          {/*Settle Up*/}
        {/*</Button>*/}

        <div style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <MButton
            onClick = {() => this.setState({ showSettleUpModal: true })}
            variant="contained" color="secondary" size="large" style={{ width: '100%', height: 48 }}>
            <Icon type={'check-circle-o'} style={{marginRight: 18}}/> Settle Up
          </MButton>
        </div>

        <Modal
          visible={this.state.showSettleUpModal}
          transparent
          maskClosable={true}
          onClose={() => this.setState({ showSettleUpModal: false })}
          title="Settle up"
          // footer={[{ text: 'Ok', onPress: () => { console.log('ok'); this.onClose('modal1')(); } }]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div >
            <div style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Avatar
                alt="Remy Sharp"
                src={this.state.userInfo.avatarUrl}
                style={{width: 60, height: 60}}
              />
            </div>

            <br />
            You pay <span style={{ color: '#484848', fontWeight: 500}}>{this.state.userInfo.username}</span>
            <br /><br />

            <FormControl style={{ marginBottom: 18 }}>
              <InputLabel htmlFor="adornment-amount">Amount</InputLabel>
              <Input
                id="adornment-amount"
                type='number'
                // value={this.state.amount}
                // onChange={this.handleChange('amount')}
                startAdornment={<InputAdornment position="start" >$</InputAdornment>}
                onChange={event => {
                  this.setState({payAmount: event.target.value})
                }}
              />
            </FormControl>

            {/* <br />
            <TextField
              id="outlined-adornment-amount"
              className={classNames(classes.margin, classes.textField)}
              variant="outlined"
              type='number'
              label="Amount"
              // value={this.state.amount}
              // onChange={this.handleChange('amount')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            /> */}
            <br/>
            <br/>
            <MButton variant="contained" color="primary" size="medium" style={{ width: '80%', marginBottom: 16}}    onClick = {() => this.postPayment(this.state.payAmount)}>
              Record Payment
            </MButton>
            <MButton variant="outlined" color="secondary" size="medium" style={{ width: '80%', marginBottom: 16 }}>
              Pay With PayPal
            </MButton>

            <WhiteSpace />
          </div>
        </Modal>

        <WhiteSpace />
        <WhiteSpace />
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flexBasis: 280,
  },
})

const UserTab = withStyles(styles)(UserTabWithoutStyle)
export { UserTab}

