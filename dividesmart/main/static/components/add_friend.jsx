import 'regenerator-runtime/runtime'

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios'
import { List, WhiteSpace, Button } from 'antd-mobile'
import Snackbar from '@material-ui/core/Snackbar';
import { MySnackbarContentWrapper } from './alert_message.jsx'
import '../style/add_friend.less'

const Item = List.Item

// axios.defaults.xsrfCookieName = 'csrftoken'
// axios.defaults.xsrfHeaderName = 'X-CSRFToken'

import {
  Link,
} from 'react-router-dom';
import ListItem from 'antd-mobile/lib/list/ListItem';
import React from 'react'
import { createForm } from 'rc-form';

const myImg = src => < img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" style={{ width: 60, height: 60 }} alt="" />;
var sampleData = [
    {
      pk: '1',
      username: 'Harry',
      avatarUrl: 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg',
      acc: 10.28,
    }, {
      pk: '2',
      username: 'Oscar',
      avatarUrl: 'https://www.osustuff.org/img/avatars/2017-04-22/211652.jpg',
      acc: 8.6,
    },
    {
      pk: '3',
      username: 'Hieu',
      avatarUrl: 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg',
      acc: 10.28,
    }, {
      pk: '4',
      username: 'Yuyang',
      avatarUrl: 'https://www.shareicon.net/data/256x256/2016/07/05/791216_people_512x512.png',
      acc: 20.66,
    }, {
      pk: '5',
      username: 'Sipanis',
      avatarUrl: 'https://www.osustuff.org/img/avatars/2017-04-22/211652.jpg',
      acc: 8.6,
    }
]

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
        <div>
          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />
          <FormControl>
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
                    extra={<Checkbox 
                      name={email.email} 
                      onClick={this.removeEmailAddress}
                      icon={<IconButton><Close/></IconButton>} >
                    </Checkbox>}
                  >
                    {email.email}
                  </Item>
                )
              })
            }
            <Button className="full-width" onClick={ () => this.addFriends() }> Add all </Button>
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
