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
import { FriendList } from './tabs/friend_list.jsx';

const RadioItem = Radio.RadioItem;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
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

class GroupCreateForm extends React.Component {
  constructor(props) {
    super()
    this.state = {
      type: 'group',
      showFriends: false,
      addFriendAlready: false,
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
    this.handleChooseFriends = this.handleChooseFriends.bind(this);
    this.updateFriends = this.updateFriends.bind(this);
  }

  handleChooseFriends() {
    const newState = this.state.showFriends ? false : true;
    this.setState({
      showFriends: newState
    });
  }

  updateFriends(added_users) {
    // const newStateA = this.state.addFriendAlready ? false : true;
    this.setState({
      addFriendAlready: true
    });

    const newStateB = this.state.showFriends ? false : true;
    this.setState({
      showFriends: newStateB
    });

    this.setState({
      users: added_users
    })
  }

  componentDidCatch(error) {
    if(!this.state.error) { // set error only once per update
       this.setState({
         error,
       })
   }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const { type } = this.state;
    return (
      <div>
        <div ref={this.mainRef} style={{display: this.state.showFriends ? 'none' : 'block'}}>
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

          <div style={{marginLeft: '80px', marginRight: '80px'}}>
            <List>
              {/* <Link to={`../u/1/friend_list/true`} > */}
                <Button onClick={this.handleChooseFriends} style={{color: 'green'}}> Add Friends </Button>
              {/* </Link> */}
            </List>
          </div>

          <div style={{display: this.state.addFriendAlready ? 'block' : 'none',
                       marginLeft: '20px', marginRight: '20px'}}>
            <FriendList isCreateGroup={false} users={this.state.users} hideSearch={true} />
          </div>
          <WhiteSpace size="lg" />

          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WingBlank>
            <Button type="primary">SAVE</Button>
          </WingBlank>
        </div>

        <div style={{display: this.state.showFriends ? 'block' : 'none'}} ref={this.friendRef}>
          <FriendList isCreateGroup={true} users={sampleData} updateUsers = {this.updateFriends}/>
          {/* <Button onClick={this.handleChooseFriends}> Submit </Button> */}
        </div>
      </div>
    );
  }
}

const GroupCreate = createForm()(GroupCreateForm);

export { GroupCreate }
