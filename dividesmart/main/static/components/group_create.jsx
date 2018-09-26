import 'regenerator-runtime/runtime'

import { Button, Card, Checkbox, Flex, Icon, InputItem, List, Radio, Result, Tabs, TextareaItem, WhiteSpace, WingBlank } from 'antd-mobile';

import {
  Link,
} from 'react-router-dom';
import ListItem from 'antd-mobile/lib/list/ListItem';
import React from 'react'
import ReceiptButton from './material/receipt_float_btn.jsx'
import { createForm } from 'rc-form';
import TextField from '@material-ui/core/TextField';
import { MultiSelectFriend } from './tabs/multi_select_friend.jsx';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import { MySnackbarContentWrapper } from './alert_message.jsx'

const RadioItem = Radio.RadioItem;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const myImg = src => < img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" style={{ width: 60, height: 60 }} alt="" />;


const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class GroupCreateForm extends React.Component {
  constructor(props) {
    super()
    this.state = {
      type: 'group',
      users: [],
      name: '',
      open: false
    }

    this.onChange2 = (value) => {
      console.log('checkbox');
      this.setState({
        value2: value,
      });
    };

    this.mainRef = React.createRef();
    this.friendRef = React.createRef();
    this.updateUsers = this.updateUsers.bind(this);
    this.createGroup = this.createGroup.bind(this);
  }

  handleChange = prop => event => { 
    this.setState({ [prop]: event });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  componentDidCatch(error) {
    if(!this.state.error) { // set error only once per update
      this.setState({
        error,
      })
    }
  }

  updateUsers(added_users) {
    this.setState({
      users: added_users
    })
    console.log(this.state)
  }

  createGroup() {
    var payload = {
      name: this.state.name,
      members: this.state.users.map(user => user.id)
    }
    axios.post('/api/groups/', payload).then((res, err) => {
      if(err) {
        throw err
      } else {
        this.setState({
          name: '',
          users: [],
          open: true
        })
        console.log(res)
      }
    })
  }

  render() {
    const { type } = this.state;
    return (
      <div>
        <div ref={this.mainRef}>

          <WhiteSpace siz='xg' />

          <InputItem
            value={this.state.name}
            onChange={this.handleChange('name')}
            placeholder="Enter group names"
          >
            <div style={{ backgroundImage: 'url(http://i64.tinypic.com/314wh1l.jpg)', backgroundSize: 'cover', height: '22px', width: '22px' }} />
          </InputItem>

          <WhiteSpace />
          <WhiteSpace />

          <TextareaItem placeholder="Enter your group description" rows="5"/>

          <WhiteSpace size="lg" />

          <WhiteSpace size="lg" />
          <MultiSelectFriend updateUsers={this.updateUsers}/>
          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WingBlank>
            <Button type="primary" onClick={this.createGroup}>SAVE</Button>
          </WingBlank>
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
              message="Group Created"
            />
          </Snackbar>
        </div>


      </div>
    );
  }
}

const GroupCreate = createForm()(GroupCreateForm);

export { GroupCreate }
