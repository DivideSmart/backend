import 'regenerator-runtime/runtime'

import { Badge, List, SearchBar, WhiteSpace } from 'antd-mobile'

import {
  Link,
} from 'react-router-dom'
import React from 'react'
import Close from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox';
const Item = List.Item
const Brief = Item.Brief


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
    }
    console.log(this.props);
    console.log("HERE");
  }

  render() {
    return (
      <div>
        <SearchBar placeholder="Search" maxLength={8} cancelText={<Close style={{minHeight: 44}} />} />
        <List renderHeader={() => 'Friends'} className="my-list">
        {
          sampleData.friends.map(friend => {
            console.log("AAAAA");
            // console.log(this.props.isCreateGroup);
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
                  extra={<span style={{ color: '#00b894' }}> <Checkbox/> </span>}
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
        </List>
        
        <WhiteSpace />
        <WhiteSpace />

    </div>)
  }
}

export { FriendList }
