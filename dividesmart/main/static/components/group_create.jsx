import 'regenerator-runtime/runtime'

import { Button, Card, Checkbox, Flex, Icon, InputItem, List, Radio, Result, Tabs, WhiteSpace, WingBlank, TextareaItem } from 'antd-mobile';

import ListItem from 'antd-mobile/lib/list/ListItem';
import React from 'react'
import ReceiptButton from './material/receipt_float_btn.jsx'
import { createForm } from 'rc-form';

import {
  Link,
} from 'react-router-dom';

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
    }
    this.onChange = () => {

    }

    this.onChange2 = (value) => {
      console.log('checkbox');
      this.setState({
        value2: value,
      });
    };
    this.updateReceipt = (content) => {
      this.setState({
        data: [
          { value: 0, label: 'Shiquasa Mojito', price: '4.90' },
          { value: 1, label: 'Cranberry Juice', price: '3.50' },
          { value: 2, label: 'Mountain Monster Curry', price: '24.00' },
        ]
      })
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const { type } = this.state;
    return (
      <div>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />

        <List>
          <InputItem
            {...getFieldProps('inputtitle2')}
            placeholder="Enter group names"
          >
            <div style={{ backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/DfkJHaJGgMghpXdqNaKF.png)', backgroundSize: 'cover', height: '22px', width: '22px' }} />
          </InputItem>
        </List>
        
        <List>
          <TextareaItem placeholder="Enter your group description" rows="5"/>
        </List>
        
        <WhiteSpace size="lg" />

        <List>
          <Link to={{ pathname: '../u/1/friend_list', query: {isCreateGroup: true }}}>
            <Button> Choose Friends </Button>
          </Link>
        </List>

        <WhiteSpace size="lg" />

        <WhiteSpace />
        <WhiteSpace />
        <WhiteSpace />
        <WingBlank>
          <Button type="primary">SAVE</Button>
        </WingBlank>
      </div>
    );
  }
}

const GroupCreate = createForm()(GroupCreateForm);

export { GroupCreate }
