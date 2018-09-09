import React from 'react'
import { List, Badge, WhiteSpace, Button, WingBlank } from 'antd-mobile';

class UserTab extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <List>
          <List.Item extra="extra content">
            <Badge>
              <span
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'url(https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg) center center /  60px 60px no-repeat',
                  display: 'inline-block' }}
              />
            </Badge>
            <span style={{ marginLeft: 12 }}>Harry</span>
          </List.Item>
          {/* <List.Item
            thumb="https://zos.alipayobjects.com/rmsportal/faMhXAxhCzLvveJ.png"
            extra={<Badge text={77} overflowCount={55} />}
            arrow="horizontal"
          >
            Content
          </List.Item>
          <List.Item><Badge text={'促'} corner>
            <div className="corner-badge">Use corner prop</div>
          </Badge></List.Item>
          <List.Item className="special-badge" extra={<Badge text={'促'} />}>
            Custom corner
          </List.Item> */}
          <List.Item extra="12345678">
            <Badge text={0} style={{ marginLeft: 12 }}>Phone number</Badge>
            {/* <Badge text={'new'} style={{ marginLeft: 12 }} /> */}
          </List.Item>

          <List.Item extra="test@test.com">
            <Badge text={0} style={{ marginLeft: 12 }}>Email address</Badge>
            {/* <Badge text={'new'} style={{ marginLeft: 12 }} /> */}
          </List.Item>
          {/* <List.Item>
            Marketing:
            <Badge text="减" hot style={{ marginLeft: 12 }} />
            <Badge text="惠" hot style={{ marginLeft: 12 }} />
            <Badge text="免" hot style={{ marginLeft: 12 }} />
            <Badge text="反" hot style={{ marginLeft: 12 }} />
            <Badge text="HOT" hot style={{ marginLeft: 12 }} />
          </List.Item>
          <List.Item>
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


        {/* <WhiteSpace />
        <WhiteSpace />
        <WingBlank>
          <Button>Create Debt</Button>
        </WingBlank> */}
      </div>
    )
  }
}


export { UserTab }

