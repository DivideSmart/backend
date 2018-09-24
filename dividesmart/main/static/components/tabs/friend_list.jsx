import 'regenerator-runtime/runtime'

import { Badge, List, SearchBar, WhiteSpace, Button } from 'antd-mobile'

import {
  Link,
} from 'react-router-dom'

import React from 'react'
import Close from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
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

class FriendList extends React.Component {
  constructor() {
    super()
    this.state = {
      disabled: false,
      added_users: [],
      remove_ids: []
    }
    this.added_keys = [];
    this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.defaultUrl = 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg';
  }

  

  // shouldComponentUpdate() {
  //   if(this.props.isClickable == false) {
  //     console.log("AO");
  //     console.log(this.props.users);
  //     this.setState({
  //       users: this.props.users
  //     })
  //   }
  // }

  renderButton(mode, updateUsers) {
    if(mode == 'multi-select' || mode == 'single-select') {
      return (
        <Button onClick={ () => updateUsers(copy(this.state.added_users)) }> ADD </Button>
      )
    }
  }

  onChangeCheckBox(e, checked) {
    if(checked && !(e.target.name in this.added_keys)) {
      this.added_keys.push(e.target.name);
      const new_user = this.props.users.filter(user => user.pk == e.target.name)[0];
      const newArray = this.state.added_users;
      newArray.push(new_user);
      this.setState({
        added_users: newArray
      });
    } else if(!checked) {
      const newArrayB = this.state.added_users.filter(user => user.pk != e.target.name);
      this.setState({
        added_users: newArrayB
      })
    }
  }

  componentDidCatch(error) {
    if(!this.state.error) { // set error only once per update
       this.setState({
         error,
       })
   }
  }

  shouldComponentUpdate(nextProp, nextState) {
    // if(JSON.stringify(this.props.alreadyAddedUsers) != JSON.stringify(nextProp.alreadyAddedUsers) ) {
    //   console.log("AHA HERE");
    // }
    // return true;
    if(JSON.stringify(this.props) == JSON.stringify(nextProp) && JSON.stringify(this.state) == nextState) {
      return false;
    } else {
      return true;
    }
  }

  componentWillReceiveProps(nextProp) {
    if(nextProp.alreadyAddedUsers) {
      var IDs = [];
      nextProp.alreadyAddedUsers.forEach(person => {
        IDs.push(person.id);
      })
      this.setState( {
        remove_ids: IDs
      })
    }
  }

  filterOut(users) {
    return users.filter(user => !user.id in this.state.remove_ids);
  }

  render() {
    return (
      <div>
        <div style={{display: this.props.hideSearch ? 'none' : 'block'}}>
          <SearchBar placeholder="Search" maxLength={8} cancelText={<Close style={{minHeight: 44}} />} />
        </div>
        <List renderHeader={() => 'Friends'} className="my-list">
        {
          this.props.users.map(friend => {
            console.log("ABC");
            console.log(friend.id);
            console.log(this.state.remove_ids);
            if (this.props.mode == 'multi-select' && (this.state.remove_ids.length > 0) && !(this.state.remove_ids.includes(friend.id))) {
              return (
                <Item
                  ref={friend.pk}
                  key={friend.id}
                  thumb={
                    <Badge>
                      <span
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'url(' + (friend.avatarUrl ? friend.avatarUrl : this.defaultUrl) + ') center center /  48px 48px no-repeat',
                          display: 'inline-block' }}
                      />
                    </Badge>
                  }
                  multipleLine
                  // onClick={() => { window.location.href = '/u/1'}}
                  extra={<span style={{ color: '#00b894' }}> <Checkbox name={friend.pk} onChange={ this.onChangeCheckBox} /> </span>}
                >
                  {friend.username} <Brief>8/31/18</Brief>
                </Item>
              )
            } else if(this.props.mode == 'display') {
              return (
                  <Link to='u/1'>
                    <Item
                      thumb={
                        <Badge>
                          <span
                            style={{
                              width: '48px',
                              height: '48px',
                              background: 'url(' + (friend.avatarUrl ? friend.avatarUrl : this.defaultUrl) + ') center center /  48px 48px no-repeat',
                              display: 'inline-block' }}
                          />
                        </Badge>
                      }
                      multipleLine
                      // onClick={() => { window.location.href = '/u/1'}}
                    >
                      {friend.username} <Brief>8/31/18</Brief>
                    </Item>
                  </Link>
              )
            } else if(this.props.mode == 'single-select') {
              return (
                <Item
                  key={friend.id}
                  thumb={
                    <Badge>
                      <span
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'url(' + (friend.avatarUrl ? friend.avatarUrl : this.defaultUrl) + ') center center /  48px 48px no-repeat',
                          display: 'inline-block' }}
                      />
                    </Badge>
                  }
                  multipleLine
                  // onClick={() => { window.location.href = '/u/1'}}
                  extra={<span style={{ color: '#00b894' }}> <Radio name={friend.pk} onChange={ this.onChangeCheckBox} /> </span>}
                >
                  {friend.username} <Brief>8/31/18</Brief>
                </Item>
              )
            }
          })
        }

        {/* {console.log(this.props.updateUsers)} */}
        { this.renderButton(this.props.mode, this.props.updateUsers) }

        </List>

        <WhiteSpace />
        <WhiteSpace />

    </div>)
  }
}

export { FriendList }
