import 'regenerator-runtime/runtime'

import { Badge, Icon, List, SearchBar, WhiteSpace } from 'antd-mobile'

import Close from '@material-ui/icons/Close';
import {FriendsList} from './shared_components/friends_list.jsx'
import React from 'react'
import axios from 'axios'
import MButton from '@material-ui/core/Button'
import {
  Link,
} from 'react-router-dom'

const Item = List.Item
const Brief = Item.Brief


var sampleData = {
  friendsOweYou: [
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
  ],
  friendsYouOwe: [
    {
      key: '1',
      name: 'Harry',
      avatarUrl: 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg',
      acc: 10.28,
    }, {
      key: '2',
      name: 'Charlie',
      avatarUrl: 'https://www.shareicon.net/data/256x256/2016/07/05/791216_people_512x512.png',
      acc: 20.66,
    }, {
      key: '3',
      name: 'Oscar',
      avatarUrl: 'https://www.osustuff.org/img/avatars/2017-04-22/211652.jpg',
      acc: 8.6,
    },
  ],
  friendsSettledUp: [

  ],
}

class FriendsTab extends React.Component {
  constructor() {
    super()
    this.state = {
      disabled: false,
      users: {friendsOweYou: [], friendsYouOwe: [], friendsSettledUp: []}
    }
  }

  componentDidMount() {
    axios.get('/api/user/friends/').then(response => {
      var friendsOweYou = []
      var friendsYouOwe = []
      var friendsSettledUp = []
      response.data.friends.forEach(friend => {
        friend.key = friend.id;
        friend.name = friend.username;
        if(parseFloat(friend.debt) > 0) {
          friend.acc = parseFloat(friend.debt)
          friendsOweYou.push(friend)
        } else if(parseFloat(friend.debt) < 0) {
          friend.acc = -parseFloat(friend.debt);
          friendsYouOwe.push(friend);
        } else {
          friend.acc = 0
          friendsSettledUp.push(friend);
        }
      })
      this.setState({
        users: {
          friendsOweYou: friendsOweYou,
          friendsYouOwe: friendsYouOwe,
          friendsSettledUp: friendsSettledUp
        }
      })
    })
  }

  render() {
    return (
      <div>
        {/* <SearchBar placeholder="Search" maxLength={8} cancelText={<Close style={{minHeight: 44}} />} /> */}
        <FriendsList friends={this.state.users}/>


        <WhiteSpace />
        <WhiteSpace />

        <div style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Link to='/addFriend' style={{ width: '80%' }}>
            <MButton
              variant="contained" color="secondary" size="large" style={{ width: '100%', height: 38 }}>
              <Icon type={'check-circle-o'} style={{marginRight: 18}}/> Add Friend
            </MButton>
          </Link>
        </div>

        <WhiteSpace />
        <WhiteSpace />

      {/* <List renderHeader={() => 'Customized Right Side（Empty Content / Text / Image）'} className="my-list">
        <Item>Title</Item>
        <Item arrow="horizontal" onClick={() => {}}>Title</Item>
        <Item extra="extra content" arrow="horizontal" onClick={() => {}}>Title</Item>
        <Item extra="10:30" align="top" thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine>
          Title <Brief>subtitle</Brief>
        </Item>
      </List>
      <List renderHeader={() => 'Align Vertical Center'} className="my-list">
        <Item multipleLine extra="extra content">
          Title <Brief>subtitle</Brief>
        </Item>
      </List>
      <List renderHeader={() => 'Icon in the left'}>
        <Item
          thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
          arrow="horizontal"
          onClick={() => {}}
        >My wallet</Item>
        <Item
          thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"
          onClick={() => {}}
          arrow="horizontal"
        >
          My Cost Ratio
        </Item>
      </List> */}
      {/* <List renderHeader={() => 'Text Wrapping'} className="my-list">
        <Item data-seed="logId">Single line，long text will be hidden with ellipsis；</Item>
        <Item wrap>Multiple line，long text will wrap；Long Text Long Text Long Text Long Text Long Text Long Text</Item>
        <Item extra="extra content" multipleLine align="top" wrap>
          Multiple line and long text will wrap. Long Text Long Text Long Text
        </Item>
        <Item extra="no arrow" arrow="empty" className="spe" wrap>
          In rare cases, the text of right side will wrap in the single line with long text. long text long text long text
        </Item>
      </List> */}
      {/* <List renderHeader={() => 'Other'} className="my-list">
        <Item disabled={this.state.disabled} extra="" onClick={() => { console.log('click', this.state.disabled); this.setState({ disabled: true }); }}>Click to disable</Item>
        <Item>
          <select defaultValue="1">
            <option value="1">Html select element</option>
            <option value="2" disabled>Unable to select</option>
            <option value="3">option 3</option>
          </select>
        </Item>
      </List> */}
    </div>)
  }
}

export { FriendsTab }
