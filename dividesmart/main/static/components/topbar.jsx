import 'regenerator-runtime/runtime'
import '../style/index.less'

import { Icon, NavBar, Popover } from 'antd-mobile'

import Home from '@material-ui/icons/Home'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Link,
} from 'react-router-dom'
import PersonAdd from '@material-ui/icons/PersonAdd';
import React from 'react'

const Item = Popover.Item

const myImg = src => <img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" alt="" />;

function PopOver(props) {
  return (
    <Popover
      overlayClassName="fortest"
      overlayStyle={{ color: 'currentColor' }}
      visible={props.visible}
      overlay={[
        (<Item key="scan" value="scan" icon={myImg('tOtXhkIWzwotgGSeptou')} data-seed="logId">
          Scan
        </Item>),

        (<Item key="qr" value="special" icon={myImg('PKAgAqZWJVNwKsAJSmXd')} style={{ whiteSpace: 'nowrap' }}>
          My Qrcode
        </Item>),

        (<Item key="help" value="button ct" icon={<PersonAdd style={{ width: 18, height: 18 }} />}>
          <span style={{ marginRight: 5 }}>Add Friend</span>
        </Item>),

        <Item key="add_group" value="button ct" icon={<FontAwesomeIcon icon='users' style={{ width: 18, height: 18 }} />}>
          <Link to='/g/create'>
            <span style={{ marginRight: 5, color: 'black' }}>Create Group</span>
          </Link>
        </Item>,
      ]}
      align={{
        overflow: { adjustY: 0, adjustX: 0 },
        offset: [-10, 0],
      }}
      onVisibleChange={props.handleVisibleChange}
      onSelect={props.onSelect}
    >
      <div style={{
        height: '100%',
        padding: '0 15px',
        marginRight: '-15px',
        display: 'flex',
        alignItems: 'center',
      }}
      >
        <Icon type="ellipsis" />
      </div>
    </Popover>
  )
}


class TopBar extends React.Component {
  constructor() {
    super()
    this.state = {
      visible: false,
      selected: '',
    };
    this.onSelect = (opt) => {
      if (opt.key == 'scan')
        window.location.href = '/qr'
      this.setState({
        visible: false,
        selected: opt.props.value,
      });
    };
    this.handleVisibleChange = (visible) => {
      this.setState({
        visible,
      });
    };
  }

  render() {
    return (
      <div style={{ height: '6vh' }}>
        <NavBar
          style={{height: '100%'}}
          icon={
            <Link className='topbar-btn' to='/'>
              <Home
                style={{width: '28px', height: '28px',}}
              />
            </Link>
          }
          mode="light"
          rightContent={
            <PopOver
              visible={this.state.visible}
              handleVisibleChange={this.handleVisibleChange}
              onSelect={this.onSelect}
            />
          }
        >
          Name of the Appp
        </NavBar>
      </div>
    )
  }
}

export { TopBar }
