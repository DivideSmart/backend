import 'regenerator-runtime/runtime'

import { Badge, List, SearchBar, WhiteSpace, Button } from 'antd-mobile'

import {
  Link,
} from 'react-router-dom'

import React from 'react'
import Close from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox';
const Item = List.Item
const Brief = Item.Brief

function copy(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
      v = o[key];
      output[key] = (typeof v === "object") ? copy(v) : v;
  }
  return output;
}

var sampleData = {
  friends: [
    {
      key: '1',
      name: 'Harry',
      avatarUrl: 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg',
      acc: 10.28,
    }, {
      key: '2',
      name: 'Oscar',
      avatarUrl: 'https://www.osustuff.org/img/avatars/2017-04-22/211652.jpg',
      acc: 8.6,
    },
    {
      key: '3',
      name: 'Hieu',
      avatarUrl: 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg',
      acc: 10.28,
    }, {
      key: '4',
      name: 'Yuyang',
      avatarUrl: 'https://www.shareicon.net/data/256x256/2016/07/05/791216_people_512x512.png',
      acc: 20.66,
    }, {
      key: '5',
      name: 'Sipanis',
      avatarUrl: 'https://www.osustuff.org/img/avatars/2017-04-22/211652.jpg',
      acc: 8.6,
    },
  ]
}

class FriendList extends React.Component {
  constructor() {
    super()
    this.state = {
      disabled: false,
      added_users: []
    }
    this.added_keys = [];
    this.onChange2 = (value) => {
      console.log(value);
      // this.setState({
      //   value2: value,
      // });
    };
    this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  renderButton(isCreateGroup, updateUsers) {
    if(isCreateGroup) {
      return (
        <Button onClick={ () => updateUsers(copy(this.state.added_users)) }> ADD </Button>
      )
    }
  }

  onChangeCheckBox(e, checked) {
    if(checked && !(e.target.name in this.added_keys)) {
      this.added_keys.push(e.target.name);
      const new_user = this.props.users.friends.filter(user => user.key == e.target.name)[0];
      const newArray = this.state.added_users;
      newArray.push(new_user);
      this.setState({
        added_users: newArray
      });
    }
  }

  componentDidCatch(error) {
    if(!this.state.error) { // set error only once per update
       this.setState({
         error,
       })
   }
  }

  render() {
    return (
      <div>
        <div style={{display: this.props.hideSearch ? 'none' : 'block'}}>
          <SearchBar placeholder="Search" maxLength={8} cancelText={<Close style={{minHeight: 44}} />} />
        </div>
        <List renderHeader={() => 'Friends'} className="my-list">
        {
          this.props.users.friends.map(friend => {
            // console.log(this.props.updateUsers);
            console.log("HIEU AAA HERE");
            if(this.props.isCreateGroup) {
              return (
                <Item
                  thumb={
                    <Badge>
                      <span
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'url(' + friend.avatarUrl + ') center center /  48px 48px no-repeat',
                          display: 'inline-block' }}
                      />
                    </Badge>
                  }
                  multipleLine
                  // onClick={() => { window.location.href = '/u/1'}}
                  extra={<span style={{ color: '#00b894' }}> <Checkbox name={friend.key} onChange={ this.onChangeCheckBox} /> </span>}
                >
                  {friend.name} <Brief>8/31/18</Brief>
                </Item>
              )
              
            }

            
            return (
                <Link to='u/1'>
                  <Item
                    thumb={
                      <Badge>
                        <span
                          style={{
                            width: '48px',
                            height: '48px',
                            background: 'url(' + friend.avatarUrl + ') center center /  48px 48px no-repeat',
                            display: 'inline-block' }}
                        />
                      </Badge>
                    }
                    multipleLine
                    // onClick={() => { window.location.href = '/u/1'}}
                  >
                    {friend.name} <Brief>8/31/18</Brief>
                  </Item>
                </Link>
            )
          })
        }

        {/* {console.log(this.props.updateUsers)} */}
        { this.renderButton(this.props.isCreateGroup, this.props.updateUsers) }

        </List>
        
        <WhiteSpace />
        <WhiteSpace />

    </div>)
  }
}

export { FriendList }
