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
      remove_ids: [],
      users: []
    }
    this.added_keys = [];
    this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
    // this.renderButton = this.renderButton.bind(this);
    this.defaultUrl = 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg';
    // this.fetch = this.fetch.bind(this);
    this.addDefaultCheck = this.addDefaultCheck.bind(this);
  }

  shouldComponentUpdate(nextProp, nextState) {
    if(JSON.stringify(nextProp) == JSON.stringify(this.props) && JSON.stringify(nextState) == JSON.stringify(this.state)) {
      return false;
    } else {
      return true;
    }
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

  // renderButton(mode, updateUsers) {
  //   if (mode == 'multi-select' || mode == 'single-select') {
  //     return (
  //       <Button onClick={ () => updateUsers(copy(this.state.added_users)) }> ADD </Button>
  //     )
  //   }
  // }

  onChangeCheckBox(e, checked) {
    // console.log("CHECKBOX update")
    // console.log(copy(this.state.added_users));
    // console.log(e.target.name)
    // console.log(checked);
    if (checked && !(e.target.name in this.added_keys)) {
      this.added_keys.push(e.target.name);
      const new_user = this.props.users.filter(user => user.pk == e.target.name)[0];
      const newArray = copy(this.state.added_users);
      newArray.push(new_user);
      // console.log("CHECKED")
      // console.log(copy(newArray))
      this.setState({
        added_users: copy(newArray)
      });
    } else if(!checked) {
      // console.log("UNCHECKED")
      console.log(this.state.added_users);
      const newArrayB = this.state.added_users.filter(user => user.pk != e.target.name);
      console.log(copy(newArrayB))
      this.setState({
        added_users: copy(newArrayB)
      })
      // console.log('test')
      // console.log(copy(this.state.added_users))
    }

    // console.log("END1")
  }

  async addDefaultCheck(friend) {
    if(friend.selected) {
      this.added_keys.push(friend.pk);
      var newArray = this.state.added_users;
      newArray.push(friend);
      await this.setState({
        added_users: copy(newArray)
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

  // shouldComponentUpdate(nextProp, nextState) {
  //   // if(JSON.stringify(this.props.alreadyAddedUsers) != JSON.stringify(nextProp.alreadyAddedUsers) ) {
  //   //   console.log("AHA HERE");
  //   // }
  //   // return true;
  //   if(JSON.stringify(this.props) == JSON.stringify(nextProp) && JSON.stringify(this.state) == nextState) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  componentWillReceiveProps(nextProp) {
    if (nextProp.alreadyAddedUsers && nextProp.isAddGroup) {
      var IDs = [];
      nextProp.alreadyAddedUsers.forEach(person => {
        IDs.push(person.id);
      })
      this.setState( {
        remove_ids: IDs
      })
    }
    this.setState({
      users: nextProp.users
    })
  }

  componentDidMount() {
    this.setState({
      users: this.props.users
    })
    var newArray = this.state.added_users;

    this.props.users.forEach(friend => {
            if(friend.selected) {
              this.added_keys.push(friend.pk);
              newArray.push(friend);
            }
          })
    this.setState({
        added_users: copy(newArray)
    })
  }

  filterOut(users) {
    return users.filter(user => !user.id in this.state.remove_ids);
  }

  // fetch(users) {
  //   console.log("COME HERE")
  //   console.log(users)
  //   return (
  //   )
  // }

  render() {
    return (
      <div>
        <div style={{display: this.props.hideSearch ? 'none' : 'block'}}>
          <SearchBar placeholder="Search" maxLength={8} cancelText={<Close style={{minHeight: 44}} />} />
        </div>
        <List renderHeader={() => 'Friends'} className="my-list">
        {
          this.state.users.map(friend => {

            if (this.props.mode == 'multi-select' && !(this.state.remove_ids.includes(friend.id))) {
              // {this.addDefaultC  heck(friend)}
              return (
                <Item
                  ref={friend.pk}
                  key={friend.id}
                  thumb={
                    <Badge>
                      <span
                        style={{
                          width: '48px', height: '48px', display: 'inline-block',
                          background: 'url(' + friend.avatarUrl + ') center center /  48px 48px no-repeat',
                        }}
                      />
                    </Badge>
                  }
                  multipleLine
                  // onClick={() => { window.location.href = '/u/1'}}
                  extra={<span style={{ color: '#00b894' }}> <Checkbox defaultChecked={friend.selected == true ? true : false} name={friend.pk} onChange={ this.onChangeCheckBox} /> </span>}
                >
                  {friend.username} <Brief>{friend.emailAddress}</Brief>
                </Item>
              )
            } else if(this.props.mode == 'display') {
              return (
                  // <Link to='u/1'>
                    <Item
                      thumb={
                        <Badge>
                          <span
                            style={{
                              width: '48px', height: '48px', display: 'inline-block',
                              background: 'url(' + friend.avatarUrl + ') center center /  48px 48px no-repeat',
                          }}
                          />
                        </Badge>
                      }
                      multipleLine
                      // onClick={() => { window.location.href = '/u/1'}}
                    >
                      {friend.username} <Brief>{friend.emailAddress}</Brief>
                    </Item>
                  // </Link>
              )
            } else if(this.props.mode == 'single-select') {
              return (
                <Item
                  key={friend.id}
                  thumb={
                    <Badge>
                      <span
                        style={{
                          width: '48px', height: '48px', display: 'inline-block',
                          background: 'url(' + friend.avatarUrl + ') center center /  48px 48px no-repeat',
                        }}
                      />
                    </Badge>
                  }
                  multipleLine
                  // onClick={() => { window.location.href = '/u/1'}}
                  extra={<span style={{ color: '#00b894' }}> <Radio name={friend.pk} onChange={ this.onChangeCheckBox} /> </span>}
                >
                  {friend.username} <Brief>{friend.emailAddress}</Brief>
                </Item>
              )
            }
          })
        }

        {
          (this.props.mode == 'multi-select' || this.props.mode == 'single-select') ?
          <Button onClick={ () => this.props.updateUsers(copy(this.state.added_users)) }> ADD </Button> :
          null
        }

        </List>

        <WhiteSpace />
        <WhiteSpace />

    </div>)
  }
}

export { FriendList }
