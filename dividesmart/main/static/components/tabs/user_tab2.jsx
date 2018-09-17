import {Badge, Button, Checkbox, List, WhiteSpace, WingBlank, Modal } from 'antd-mobile';

import React from 'react'

const Item = List.Item
const Brief = Item.Brief

const prompt = Modal.prompt
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'


class UserTab extends React.Component {
  constructor() {
    super()
    this.state = {
      showSettleUpModal: false
    }
  }

  render() {
    return (
      <div>
        <WhiteSpace />
        <WhiteSpace />
        <List>
          <List.Item extra="extra content" arrow="horizontal">
            <Badge>
              <span
                style={{
                  width: '60px',
                  height: '60px',
                  margin: '6px 0px 0px 0px',
                  background: 'url(https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg) center center /  60px 60px no-repeat',
                  display: 'inline-block' }}
              />
            </Badge>
            <span style={{ marginLeft: 12 }}>Harry</span>
          </List.Item>

          <List.Item extra="12345678" arrow="horizontal">
            <Badge text={0} style={{ marginLeft: 12 }}>Phone number</Badge>
            {/* <Badge text={'new'} style={{ marginLeft: 12 }} /> */}
          </List.Item>

          <List.Item extra="test@test.com" arrow="horizontal">
            <Badge text={0} style={{ marginLeft: 12 }}>Email address</Badge>
            {/* <Badge text={'new'} style={{ marginLeft: 12 }} /> */}
          </List.Item>

          {/* <List.Item>
            Customize
            <Badge text="券" style={{ marginLeft: 12, padding: '0 3px', backgroundColor: '#f19736', borderRadius: 2 }} />
            <Badge text="NEW" style={{ marginLeft: 12, padding: '0 3px', backgroundColor: '#21b68a', borderRadius: 2 }} />
            <Badge text="自动缴费"
              style={{
                marginLeft: 12,
                padding: '0 3px',
                backgroundColor: '#fff',
                borderRadius: 2,
                color: '#f19736',
                border: '1px solid #f19736',
              }}
            />
          </List.Item> */}
        </List>

        <WhiteSpace />
        <List renderHeader={() => 'Debt List with Tom'} className="my-list">
          {/*<Item extra={'Debt'}>Date</Item>*/}
        </List>
        <List>
          <Item
            arrow="horizontal"
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine
            onClick={() => {}}
            extra={<span className={'other-owe-amount'}>$10</span>}
          >
            Lunch @ PGP<Brief>8/29/18</Brief>
          </Item>
          <Item
            arrow="horizontal"
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine
            onClick={() => {}}
            extra={<span className={'owe-other-amount'}>-$5</span>}
          >
            Movie Night<Brief>8/30/18</Brief>
          </Item>
          <Item
            arrow="horizontal"
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine
            onClick={() => {}}
            extra={<span className={'other-owe-amount'}>$15</span>}
          >
            Dinner Date <Brief>8/31/18</Brief>
          </Item>
          <Item
            arrow="horizontal"
            // thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine
            onClick={() => {}}
            extra={<span className={'other-owe-amount'}>$20</span>}
          >
            <Brief>Overall</Brief>
          </Item>
        </List>

        <WhiteSpace />
        <WhiteSpace />
        <WhiteSpace />

        <Button
          type="primary" icon="check-circle-o"
          // onClick={
          //   () => prompt('defaultValue', 'defaultValue for prompt',
          //     [
          //       { text: 'Cancel' },
          //       { text: 'Submit', onPress: value => console.log(`输入的内容:${value}`) },
          //     ], 'default', '100')
          // }
          onClick = {() => this.setState({ showSettleUpModal: true })}
        >
          Settle Up
        </Button>

        <Modal
          visible={this.state.showSettleUpModal}
          transparent
          maskClosable={true}
          onClose={() => this.setState({ showSettleUpModal: false })}
          title="Settle up"
          // footer={[{ text: 'Ok', onPress: () => { console.log('ok'); this.onClose('modal1')(); } }]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div >
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
            scoll content...<br />
          </div>
        </Modal>

        <WhiteSpace />
        <WhiteSpace />
      </div>
    )
  }
}


export { UserTab }

