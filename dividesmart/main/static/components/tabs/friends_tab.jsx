import 'regenerator-runtime/runtime'

import { Badge, List } from 'antd-mobile'

import React from 'react'

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
    }
  }

  render() {
    return (<div>
      <List renderHeader={() => 'Friends owe you'} className="my-list">
      {
        sampleData.friendsOweYou.map(friend => {
          return (
            <Item
              key={friend.key}
              arrow="horizontal"
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
              onClick={() => { window.location.href = '/u/1'}}
              extra={<span style={{ color: '#00b894' }}>${ friend.acc }</span>}
            >
              {friend.name} <Brief>8/31/18</Brief>
            </Item>
          )
        })
      }
      </List>


      <List renderHeader={() => 'Friends you owe'} className="my-list">
        {/* <Item arrow="horizontal" multipleLine onClick={() => {}}>
          Title <Brief>subtitle</Brief>
        </Item>
        <Item
          arrow="horizontal"
          multipleLine
          onClick={() => {}}
          platform="android"
        >
          ListItem （Android）<Brief>There may have water ripple effect of <br /> material if you set the click event.</Brief>
        </Item> */}
        {
          sampleData.friendsYouOwe.map(friend => {
            return (
              <Item
                key={friend.key}
                arrow="horizontal"
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
                onClick={() => { window.location.href = '/u/1'}}
                extra={<span style={{ color: '#e67e22' }}>${ friend.acc }</span>}
              >
                {friend.name} <Brief>8/31/18</Brief>
              </Item>
            )
          })
        }
      </List>


      <List renderHeader={() => 'Friends settled up'} className="my-list">
        {/* <Item arrow="horizontal" multipleLine onClick={() => {}}>
          Title <Brief>subtitle</Brief>
        </Item>
        <Item
          arrow="horizontal"
          multipleLine
          onClick={() => {}}
          platform="android"
        >
          ListItem （Android）<Brief>There may have water ripple effect of <br /> material if you set the click event.</Brief>
        </Item> */}
        {
          sampleData.friendsYouOwe.map(friend => {
            return (
              <Item
                key={friend.key}
                arrow="horizontal"
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
                onClick={() => { window.location.href = '/u/1'}}
                extra={<span>settled up</span>}
              >
                {friend.name} <Brief>8/31/18</Brief>
              </Item>
            )
          })
        }
      </List>

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
