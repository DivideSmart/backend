import 'regenerator-runtime/runtime'

import { Badge, Button, List, SearchBar, WhiteSpace } from 'antd-mobile'

import Checkbox from '@material-ui/core/Checkbox';
import Close from '@material-ui/icons/Close';
import {
  Link,
} from 'react-router-dom'
import Radio from '@material-ui/core/Radio';
import React from 'react'

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
      users: [],
      display_users: undefined,
    }
    this.added_keys = [];
    this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
    // this.renderButton = this.renderButton.bind(this);
    this.defaultUrl = 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg';
    // this.fetch = this.fetch.bind(this);
    this.addDefaultCheck = this.addDefaultCheck.bind(this);
    
    this.onSearchChange = (value) => {
      const display_users = this.state.users.filter(user => user.username.includes(value))
      if (value == '')
        this.setState({display_users: undefined})
      else
        this.setState({display_users: display_users})
    }
  }

  shouldComponentUpdate(nextProp, nextState) {
    if(JSON.stringify(nextProp) == JSON.stringify(this.props) && JSON.stringify(nextState) == JSON.stringify(this.state)) {
      return false;
    } else {
      return true;
    }
  }
  
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
      // console.log(copy(this.state.added_users))
    }
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
      users: nextProp.users,
      display_users: undefined,
    })
  }

  componentDidMount() {
    this.setState({
      users: this.props.users,
      display_users: undefined,
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
  
  render() {
    return (
      <div>
        <div style={{display: this.props.hideSearch ? 'none' : 'block'}}>
          <SearchBar 
            placeholder="Search" 
            maxLength={8} 
            cancelText={<Close style={{minHeight: 44}} />} 
            onSubmit={() => this.setState({display_users: undefined})}
            onClear={() => this.setState({display_users: undefined})}
            onCancel={() => this.setState({display_users: undefined})}
            onChange={this.onSearchChange}
          />
        </div>
        <List renderHeader={() => 'Friends'} className="my-list">
        {
          (this.state.display_users == undefined ? this.state.users : this.state.display_users).map(friend => {

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
                  extra={<span style={{ color: '#00b894' }}> 
                  <Checkbox 
                    defaultChecked={friend.selected} 
                    name={friend.pk} 
                    checked={this.state.added_users.map(user => user.id).includes(friend.id)} 
                    onChange={ this.onChangeCheckBox} /> 
                  </span>}
                >
                  {friend.username} <Brief>{friend.emailAddress}</Brief>
                </Item>
              )
            } else if(this.props.mode == 'display') {
              return (
                // <Link to='u/1'>
                  <Item
                    key={friend.pk}
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
