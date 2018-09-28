import {Badge, Button, Checkbox, Icon, List, WhiteSpace, WingBlank} from 'antd-mobile';

import { FriendList } from './friend_list.jsx';
import { Link } from 'react-router-dom'
import MButton from '@material-ui/core/Button'
import React from 'react'
import axios from 'axios'

const Item = List.Item;
const Brief = Item.Brief;

class MultiSelectFriend extends React.Component {
  constructor() {
    super()
    this.state = {
      type: 'group',
      addFriendAlready: true,
      users: [],
      friends: []
    }
    this.handleChooseFriends = this.handleChooseFriends.bind(this);
    this.updateFriends = this.updateFriends.bind(this);
  }

  handleChooseFriends() {
    console.log(this.state.addFriendAlready)
    if(this.state.addFriendAlready) {
      this.setState({
        addFriendAlready: false
      });
      //window.location.href = '/g/' + this.props.group_id
    } else {
      this.setState({
        addFriendAlready: true
      });
    }
  }

  async updateFriends(added_users) {
    // const newStateA = this.state.addFriendAlready ? false : true;
    this.setState({
      addFriendAlready: true
    });
    var ids = {}
    added_users = added_users.filter(user => {if(ids[user.id]) {return false;} else { ids[user.id] = true; return true;}})
    if (this.props.isAddGroup) {
      var final_users = this.state.users.concat(added_users)
      var ids = {}
      final_users = final_users.filter(user => {if(ids[user.id]) {return false;} else { ids[user.id] = true; return true;}})
      await this.setState({
        users: final_users//this.state.users.concat(added_users)
      })
    } else {
      await this.setState({
        users: added_users
      })
    }

    console.log("ADDED");

    if(this.props.isAddGroup) {
      console.log(added_users);
      var added_users_ids = added_users.map(x => x.id)
      axios.post('/api/groups/' + this.props.group_id + '/members/',
                {ids: added_users_ids}).then(response => console.log(response))
    }

    if(this.props.updateUsers) {
      console.log("HERE");
      console.log(this.state.users);
      this.props.updateUsers(this.state.users)
    }
  }


  componentDidMount() {
    axios.get('/api/user/friends').then(responseB => {
      var friends = responseB.data.friends;
      friends = friends.map(friend => {
        friend.pk = friend.id;
        return friend;
      })
      this.setState({
        friends: friends
      })
      console.log("friends")
      console.log(this.state.friends);
    })

    if(this.props.isAddGroup) {
      this.findFriendList(this.props.group_id);
    }
  }

  findFriendList(groupID) {
    if(this.props.isAddGroup) {
      axios.get('/api/groups/' + groupID + '/members').then(response => {

        console.log("re");
        this.setState({
          users: response.data.members
        })
        console.log(this.state.users);

      })
    }
  }

  // createSubmitAddFriend()

  render() {
    return (
      <div>
        {/* { this.updateUsers() } */}
        <div style={{display: this.state.addFriendAlready ? 'block' : 'none'}}>
          <div>
            <FriendList mode='display' users={this.state.users} hideSearch={true} />
          </div>

          <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 18
            }}
          >
            <MButton
              onClick={this.handleChooseFriends}
              variant="outlined" color="secondary" size="large" style={{ width: '88%', height: 48 }}>
              Add Friends
            </MButton>
          </div>
        </div>

        <div style={{display: this.state.addFriendAlready ? 'none' : 'block'}}>
          <FriendList mode='multi-select' users={this.state.friends} updateUsers = {this.updateFriends} alreadyAddedUsers={this.state.users} isAddGroup={this.props.isAddGroup}/>
          {/* <Button onClick={this.handleChooseFriends}> Submit </Button> */}
        </div>

        {/* { this.createSubmitAddFriend } */}
      </div>

    )
  }
}


export { MultiSelectFriend }

