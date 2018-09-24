import {Badge, Button, Checkbox, List, WhiteSpace, WingBlank} from 'antd-mobile';

import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import { FriendList } from './friend_list.jsx';

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

  updateFriends(added_users) {
    // const newStateA = this.state.addFriendAlready ? false : true;
    this.setState({
      addFriendAlready: true
    });

    this.setState({
      users: added_users
    })
  }


  componentWillMount() {
      axios.get('/api/user').then(responseA => {
        var currentUser = responseA.data.id;
        axios.get('/api/users/' + currentUser + '/friends').then(responseB => {
          var friends = responseB.data.friends;
          friends = friends.map(friend => {
                                   friend.pk = friend.id;
                                   friend.avatarUrl = 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg';
                                   return friend;
                                })
          this.setState({
            friends: friends
          })
          // this.props.users = friends;

        })
      })
  }


  render() {
    return (  
      <div>
          
          <div style={{display: this.state.addFriendAlready ? 'block' : 'none'}}>
            <div style={{ marginLeft: '20px', marginRight: '20px'}}>
              <FriendList mode='display' users={this.state.users} hideSearch={true} />
            </div>

            <div style={{marginLeft: '80px', marginRight: '80px'}}>
              <List>
                {/* <Link to={`../u/1/friend_list/true`} > */}
                  <Button onClick={this.handleChooseFriends} style={{color: 'green'}}> Add Friends </Button>
                {/* </Link> */}
              </List>
            </div>
          </div>

          <div style={{display: this.state.addFriendAlready ? 'none' : 'block'}}>
            <FriendList mode='multi-select' users={this.state.friends} updateUsers = {this.updateFriends}/>
            {/* <Button onClick={this.handleChooseFriends}> Submit </Button> */}
          </div>
      </div>

    )
  }
}


export { MultiSelectFriend }

