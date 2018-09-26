import 'regenerator-runtime/runtime'
import '../style/index.less'
import '../style/topbar.less'

import { Icon, NavBar, Popover } from 'antd-mobile'

import Home from '@material-ui/icons/Home'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Link,
} from 'react-router-dom'
import PersonAdd from '@material-ui/icons/PersonAdd';
import React from 'react'
import axios from 'axios'

const Item = Popover.Item

const myImg = src => <img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" alt="" />;

function PopOver(props) {
  return (
    <Popover
      overlayClassName="fortest"
      overlayStyle={{ color: 'currentColor' }}
      visible={props.visible}
      overlay={[
        // (<Item key="scan" value="scan" icon={myImg('tOtXhkIWzwotgGSeptou')} data-seed="logId">
        //   Scan
        // </Item>),
        //
        // (<Item key="qr" value="special" icon={myImg('PKAgAqZWJVNwKsAJSmXd')} style={{ whiteSpace: 'nowrap' }}>
        //   My Qrcode
        // </Item>),

        (<Item key="help" value="button ct" icon={<PersonAdd class="icon-size" />}>
          <Link to='/addfriend'>
            <span id="link-style">Add Friend</span>
          </Link>
        </Item>),

        (<Item key="add_group" value="button ct" icon={<FontAwesomeIcon icon='users' class="icon-size" />}>
          <Link to='/g/create'>
            <span id="link-style">Create Group</span>
          </Link>
        </Item>),

        (<Item key="logout" value="button ct" icon={<FontAwesomeIcon icon='sign-out-alt' class="icon-size" />}
        > Logout
        </Item>),
      ]}
      align={{
        overflow: { adjustY: 0, adjustX: 0 },
        offset: [-10, 0],
      }}
      onVisibleChange={props.handleVisibleChange}
      onSelect={props.onSelect}
    >
      <div id="ellipsis-icon">
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
      else if(opt.key == 'qr')
        window.location.href = '/code'
      else if(opt.key == 'logout')
        this.logout()
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
    
    this.logout = () => {
      console.log("LOL")
      axios.post('/api/logout/').then((res, err) => {
        if(err) {
          throw err
        } else {
          console.log(res)
          window.location.href = '/login'
        }
      })
    }
  }

  render() {
    return (
      <div id="navbar-style">
        <NavBar
          style={{height: '100%'}}
          icon={
            <Link className='topbar-btn' to='/' aria-label='home'>
              {/*<Home id="home-icon" />*/}
              <img src={'/static/img/logo-white.png'} className="spe am-icon am-icon-md" alt="" />
            </Link>
          }
          // mode="light"
          rightContent={
            <PopOver
              style={{color: 'white'}}
              visible={this.state.visible}
              handleVisibleChange={this.handleVisibleChange}
              onSelect={this.onSelect}
            />
          }
        >
          <span style={{fontFamily: 'Open Sans, sans-serif', fontWeight: 600, fontSize: 18, color: 'white'}}>WeShare</span>
        </NavBar>
      </div>
    )
  }
}

export { TopBar }
