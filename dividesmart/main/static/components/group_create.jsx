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
      users: []
    }
    this.onChange = () => {

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
  }

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
    console.log("STATE")
    console.log(this.state)
  }

  render() {
    const { getFieldProps } = this.props.form;
    const { type } = this.state;
    return (
      <div>
        <div ref={this.mainRef}>

          <WhiteSpace siz='xg' />

          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />

          <List>
            <InputItem
              {...getFieldProps('inputtitle2')}
              placeholder="Enter group names"
            >
              <div style={{ backgroundImage: 'url(http://i64.tinypic.com/314wh1l.jpg)', backgroundSize: 'cover', height: '22px', width: '22px' }} />
            </InputItem>
          </List>

          <WhiteSpace />
          <WhiteSpace />


          <List>
            <TextareaItem placeholder="Enter your group description" rows="5"/>
          </List>

          <WhiteSpace size="lg" />

          <WhiteSpace size="lg" />
          <MultiSelectFriend updateUsers={this.updateUsers}/>
          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WingBlank>
            <Button type="primary">SAVE</Button>
          </WingBlank>
        </div>


      </div>
    );
  }
}

const GroupCreate = createForm()(GroupCreateForm);

export { GroupCreate }
