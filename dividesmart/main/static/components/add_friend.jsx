import 'regenerator-runtime/runtime'
import '../style/add_friend.less'

import { Button, List, WhiteSpace, Icon } from 'antd-mobile'

import Checkbox from '@material-ui/core/Checkbox';
import Close from '@material-ui/icons/Close';
import Done from '@material-ui/icons/Done';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import {
  Link,
} from 'react-router-dom';
import ListItem from 'antd-mobile/lib/list/ListItem';
import MButton from '@material-ui/core/Button'
import { MySnackbarContentWrapper } from './alert_message.jsx'
import PersonAdd from '@material-ui/icons/PersonAdd';
import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import MailOutline from '@material-ui/icons/MailOutline';
import axios from 'axios'
import { createForm } from 'rc-form';

const Item = List.Item

// axios.defaults.xsrfCookieName = 'csrftoken'
// axios.defaults.xsrfHeaderName = 'X-CSRFToken'


const myImg = src => < img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" style={{ width: 60, height: 60 }} alt="" />;

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class AddFriendForm extends React.Component {

  constructor(props) {
    super()
    this.state = {
      email: '',
      entered: [],
      requestsSent: false,
      open: false
    };
    this.addEmailAddress = this.addEmailAddress.bind(this);
    this.removeEmailAddress = this.removeEmailAddress.bind(this);
    this.addFriends = this.addFriends.bind(this);
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  addFriends(event) {
    this.state.entered.forEach(email => {
      var payload={
        "friendEmail": email.email,
      }
      axios.post('http://localhost:8000/api/user/friends/', payload)
      .then((res, err) => {
        if(err) {
          console.log(err)
        } else {
          console.log(res)
        }
      })
    })
    this.setState({
      requestsSent: true,
      open: true
    })
  }

  addEmailAddress(event) {
    this.state.entered.push({key: this.state.entered.length + 1, email: this.state.email})
    this.setState({
      email: '',
      entered: this.state.entered
    })
  }

  removeEmailAddress(event, checked) {
    this.setState({
      entered: this.state.entered.filter(email => email.email != event.target.name)
    })
  }

  render() {
    const { classes } = this.props;
    // const suffix = userName ? <Icon type="check-circle"/> : null;
    return (
      <div>
        <div style={{textAlign: 'center'}}>
          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />
          <FormControl style={{width: '80%'}}>
            <Input
              className="full-width"
              id="adornment-email"
              placeholder="Enter email address"
              type='text'
              value={this.state.email}
              onChange={this.handleChange('email')}
              startAdornment={
                <InputAdornment position="start">
                  <IconButton
                  >
                  <PersonAdd />
                  </IconButton>
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment>
                  <IconButton
                    onClick={this.addEmailAddress}
                  >
                  <Done />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <WhiteSpace />
          <WhiteSpace />
          <List renderHeader={() => this.state.entered.length > 0 ? 'Selected emails' : ''} className="email-list">
            {
              this.state.entered.map(email => {
                return (
                  <Item
                    className="full-width"
                    key = {email.key}
                    extra={
                      <Checkbox
                        style={{ width: 28, height: 28, }}
                        name={email.email}
                        onClick={this.removeEmailAddress}
                        icon={<IconButton><Close /></IconButton>} >
                      </Checkbox>
                    }
                  >
                    {email.email}
                  </Item>
                )
              })
            }

            {/* <Button className="full-width" onClick={ () => this.addFriends() }> Add all </Button> */}
          </List>


          <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 38
            }}
          >
            <Link to='/addfriend' style={{ width: '80%' }}>
              <MButton
                variant="contained" color="secondary" size="large" style={{ width: '100%', height: 38 }}>
                
                <MailOutline style={{ marginRight: 18 }} />
                <span style={{ marginTop: 3 }}>
                  Add Friend
                </span>
              </MButton>
            </Link>
          </div>


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
              message="Sending Requests!"
            />
          </Snackbar>
        </div>
      </div>
    );
  }
}

const AddFriend = createForm()(AddFriendForm);

export { AddFriend }
//
