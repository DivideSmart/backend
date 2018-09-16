import {Badge, Button, Checkbox, List, WhiteSpace, WingBlank} from 'antd-mobile';

import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

const Item = List.Item;
const Brief = Item.Brief;
class GroupInfoTab extends React.Component {
  constructor() {
    super()
    console.log("B");
  }

  render() {
    return (
      <div>
        <WhiteSpace />
        <WhiteSpace />
        <List>

          <List.Item extra= {this.props.name} arrow="horizontal">
            <Badge text={0} style={{ marginLeft: 12 }}>Group Name</Badge>
            {/* <Badge text={'new'} style={{ marginLeft: 12 }} /> */}
          </List.Item>

          <Link to={'/u/' + this.props.groupID +  "/friend_list"}>
            <List.Item extra= {this.props.count_user} arrow="horizontal">
              <Badge text={0} style={{ marginLeft: 12 }}>Users</Badge>
            </List.Item>
          </Link>

        </List>
      </div>

    )
  }
}


export { GroupInfoTab }

