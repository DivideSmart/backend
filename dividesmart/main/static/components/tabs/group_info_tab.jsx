import {Badge, Button, Checkbox, List, WhiteSpace, WingBlank} from 'antd-mobile';

import React from 'react'

const Item = List.Item;
const Brief = Item.Brief;
class GroupInfoTab extends React.Component {
  constructor() {
    super()
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

          <List.Item extra= {this.props.count_users} arrow="horizontal">
            <Badge text={0} style={{ marginLeft: 12 }}>Users</Badge>
            {/* <Badge text={'new'} style={{ marginLeft: 12 }} /> */}
          </List.Item>

        </List>
      </div>

    )
  }
}


export { GroupInfoTab }

