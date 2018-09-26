import 'regenerator-runtime/runtime'

import { Badge, List, WhiteSpace } from 'antd-mobile'

import {
  Link,
} from 'react-router-dom'
import React from 'react'

const Item = List.Item
const Brief = Item.Brief


class FriendsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      friends: props.friends,
      total_other_owe: 0,
      total_owe_other: 0
    }
  }


  componentWillReceiveProps(nextProp) {
    var total_other_owe = nextProp.friends.friendsOweYou.reduce((a, b) => b.acc + a, 0);
    var total_owe_other = nextProp.friends.friendsYouOwe.reduce((a, b) => b.acc + a, 0);
    this.setState({
      total_other_owe: total_other_owe,
      total_owe_other: total_owe_other,
      friends: nextProp.friends
    })
  }

  render() {
    return (
      <div>
        <List renderHeader={() => (
          <span>
            Friends owe you
            <span style={{float: 'right'}}>
              total: <span className={'other-owe-amount'}>
                {'$' + this.state.total_other_owe}
              </span>
            </span>
          </span>
        )} className="my-list">
        {
          this.state.friends.friendsOweYou.map(friend => {
            return (
              <Item
                key={friend.key}
                arrow="horizontal"
                thumb={
                  <Badge>
                    <span
                      style={{
                        width: '44px',
                        height: '44px',
                        background: 'url(' + friend.avatarUrl + ') center center /  44px 44px no-repeat',
                        display: 'inline-block' }}
                    />
                  </Badge>
                }
                multipleLine
                // onClick={() => { window.location.href = '/u/1'}}
                extra={<Link key={friend.key} to={"/u/"+friend.id} style={{ color: 'black' }}><span className={'other-owe-amount'}>${ friend.acc }</span></Link>}
              >
                <Link to={"/u/"+friend.id} style={{ color: 'black' }}>
                  {friend.name} <Brief>8/31/18</Brief>
                </Link>
              </Item>
            )
          })
        }
        </List>


        <List renderHeader={() => (
          <span>
            Friends you owe
            <span style={{float: 'right'}}>
              total: <span className={'owe-other-amount'}>
                {'$' + this.state.total_owe_other}
              </span>
            </span>
          </span>
        )} className="my-list">
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
            this.state.friends.friendsYouOwe.map(friend => {
              return (
                <Item
                  key={friend.key}
                  arrow="horizontal"
                  thumb={
                    <Badge>
                      <span
                        style={{
                          width: '44px',
                          height: '44px',
                          background: 'url(' + friend.avatarUrl + ') center center /  44px 44px no-repeat',
                          display: 'inline-block' }}
                      />
                    </Badge>
                  }
                  multipleLine
                  extra={<Link key={friend.key} to={"/u/"+friend.id} style={{ color: 'black' }}><span className={'owe-other-amount'}>${ friend.acc }</span></Link>}
                >
                  <Link key={friend.key} to={"/u/"+friend.id} style={{ color: 'black' }}>
                    {friend.name} <Brief>8/31/18</Brief>
                  </Link>
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
            this.state.friends.friendsSettledUp.map(friend => {
              return (
                <Item
                  key={friend.key}
                  arrow="horizontal"
                  thumb={
                    <Badge>
                      <span
                        style={{
                          width: '44px',
                          height: '44px',
                          background: 'url(' + friend.avatarUrl + ') center center /  44px 44px no-repeat',
                          display: 'inline-block' }}
                      />
                    </Badge>
                  }
                  multipleLine
                  extra={<Link key={friend.key} to={"/u/"+friend.id} style={{ color: 'black' }}><span className={'owe-other-amount'}>${ friend.acc }</span></Link>}
                >
                  <Link key={friend.key} to={"/u/"+friend.id} style={{ color: 'black' }}>
                    {friend.name} <Brief>8/31/18</Brief>
                  </Link>
                </Item>
              )
            })
          }
        </List>

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

export { FriendsList }
