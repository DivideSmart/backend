import 'regenerator-runtime/runtime'

import { Badge, List, SearchBar } from 'antd-mobile';

import {
  Link,
} from 'react-router-dom'

import React from 'react'
import Close from '@material-ui/icons/Close';
import Group from '@material-ui/icons/Group';
import axios from 'axios'

const Item = List.Item;
const Brief = Item.Brief;

function copy(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
      v = o[key];
      output[key] = (typeof v === "object") ? copy(v) : v;
  }
  return output;
}

var sampleData = {
  groupsOweYou: [
    {
      key: '1',
      name: 'Farewell Dinner',
      acc: 10.28,
      lastActivityDate: '8/31/18',
    }, {
      key: '2',
      name: 'Housemates',
      acc: 8.6,
      lastActivityDate: '8/30/18',
    },
  ],
  groupsYouOwe: [
    {
      key: '1',
      name: 'Movie',
      acc: 10.28,
      lastActivityDate: '8/31/18',
    }, {
      key: '2',
      name: 'Birthday Party',
      acc: 20.66,
      lastActivityDate: '8/31/18',
    },
  ],
  groupsSettledUp: [
    {
      key: '1',
      name: 'Road Trip',
      acc: 100.28,
      lastActivityDate: '8/31/18',
    },
  ],
}

class GroupTab extends React.Component {
  constructor() {
    super()
    this.state = {
      disabled: false,
      groupsOweYou: [],
      groupsYouOwe: [],
      groupsSettledUp: []
    }
  }

  // Need to discuss about definition of owe, owed and settled up.
  componentWillMount() {
    axios.get('/api/users/' + localStorage.userPk + "/groups").then(response => {
      // console.log(response);

      response.data.groups.map(group_entry => {
        var group_pk = group_entry.pk;
        axios.get('/api/groups/' + group_pk.toString() + "/entries").then(responseA => {
          var acc = responseA.data.entries.reduce((x, y) => x.user_amount +    y.user_amount, {user_amount: 0});
          // This check is not correct in some sense, need to discuss

          var newArray = [];
          group_entry.acc = acc;
          if(acc > 0) {
            newArray = copy(this.state.groupsOweYou);
            newArray.push(group_entry);
            this.setState({
              groupsOweYou: newArray
            })
          } else if (acc < 0) {
            newArray = copy(this.state.groupsYouOwe);
            newArray.push(group_entry);
            this.setState({
              groupsYouOwe: newArray
            })
          } else{
            newArray = copy(this.state.groupsSettledUp);
            newArray.push(group_entry);
            this.setState({
              groupsSettledUp: newArray
            })
          }
        })
      } );

    })
  }

  render() {
    return (
    <div>
      <SearchBar placeholder="Search" maxLength={8} cancelText={<Close style={{minHeight: 44}} />} />
      <List renderHeader={() => 'Groups owe you'} className="my-list">
      {
        this.state.groupsOweYou.map(group => {
          return (
            <Link key={group.key} to={"g/" + (group.pk)} onClick={e => e.stopPropagation()}>
              <Item
                key={group.key}
                arrow="horizontal"
                thumb={
                  <Badge>
                    <Group
                      style={{
                        width: '48px',
                        height: '48px',
                        display: 'inline-block' }}
                    />
                  </Badge>
                }
                multipleLine
                // onClick={() => { window.location.href = '/u/1'}}
                extra={<span style={{ color: '#00b894' }}>${ group.acc }</span>}
              >
                {group.name} <Brief>{group.lastActivityDate}</Brief>
              </Item>
            </Link>
          )
        })
      }
      </List>


      <List renderHeader={() => 'Groups you owe'} className="my-list">
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
          this.state.groupsYouOwe.map(group => {
          return (
            <Link key={group.key} to={"/g/"+group.pk}>
              <Item
              key={group.key}
              arrow="horizontal"
              thumb={
                <Badge>
                  <Group
                    style={{
                      width: '48px',
                      height: '48px',
                      display: 'inline-block' }}
                  />
                </Badge>
              }
              multipleLine
              // onClick={() => { window.location.href = '/u/1'}}
              extra={<span style={{ color: '#e67e22' }}>${ group.acc }</span>}
            >
              {group.name} <Brief>{group.lastActivityDate}</Brief>
              </Item>  
            </Link>
            )
          })
        }
      </List>


      <List renderHeader={() => 'Groups settled up'} className="my-list">
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
          this.state.groupsSettledUp.map(group => {
          return (
            <Link key={group.key} to={"/g/" + group.pk}>
              <Item
                key={group.key}
                arrow="horizontal"
                thumb={
                  <Badge>
                    <Group
                      style={{
                        width: '48px',
                        height: '48px',
                        display: 'inline-block' }}
                    />
                  </Badge>
                }
                multipleLine
                onClick={() => { window.location.href = '/u/1'}}
                extra={<span>settled up</span>}
              >
                {group.name} <Brief>{group.lastActivityDate}</Brief>
                </Item>
            </Link>
            )
          })
        }
      </List>

      {/*<List renderHeader={() => 'Customized Right Side（Empty Content / Text / Image）'} className="my-list">
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
      </List>
       <List renderHeader={() => 'Text Wrapping'} className="my-list">
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

export { GroupTab }
