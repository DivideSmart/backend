import {Badge, Button, Checkbox, List, Icon, WhiteSpace, WingBlank} from 'antd-mobile';

import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FriendList } from './friend_list.jsx';
import MButton from '@material-ui/core/Button'

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
    const newState = this.state.addFriendAlready ? false : true;
    this.setState({
      addFriendAlready: newState
    });
  }

  async updateFriends(added_users) {
    // const newStateA = this.state.addFriendAlready ? false : true;
    this.setState({
      addFriendAlready: true
    });

    if(this.props.isAddGroup) {
      await this.setState({
        users: this.state.users.concat(added_users)
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
        friend.avatarUrl = 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg';
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
              variant="contained" color="secondary" size="large" style={{ width: '100%', height: 48 }}>
              <Icon type={'check-circle-o'} style={{marginRight: 18}}/>Add Friends
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

