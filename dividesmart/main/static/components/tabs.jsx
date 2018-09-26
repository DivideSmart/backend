import '../style/tabs.less'

import { ListView, TabBar } from 'antd-mobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FriendsTab } from './tabs/friends_tab.jsx'
import { GroupTab } from './tabs/group_tab.jsx'
import React from 'react'
import { UserTab } from './tabs/user_tab3.jsx'

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'blueTab',
      hidden: false,
    };
  }

  render() {
    return (
      <div id="tab-bar">
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#0060c0"
          barTintColor="white"
          tabBarPosition="bottom"
          hidden={this.state.hidden}
          prerenderingSiblingsNumber={0}
        >
          <TabBar.Item
            title="Home"
            key="Home"
            icon={
              <FontAwesomeIcon icon='home' className="icon" />
            }
            selectedIcon={
              <FontAwesomeIcon icon='home' className="icon" />
            }
            selected={this.state.selectedTab === 'blueTab'}
            // badge={1}
            onPress={() => {
              this.setState({
                selectedTab: 'blueTab',
              });
            }}
            data-seed="logId"
          >
            <FriendsTab />
          </TabBar.Item>

          <TabBar.Item
            icon={
              <FontAwesomeIcon icon='users' className="icon" />
            }
            selectedIcon={
              <FontAwesomeIcon icon='users' className="icon" />
            }
            title="Groups"
            key="Groups"
            selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'redTab',
              });
            }}
            data-seed="logId1"
          >
            <GroupTab />
          </TabBar.Item>

          <TabBar.Item
            icon={
              <FontAwesomeIcon icon='user-circle' className="icon" />
            }
            selectedIcon={
              <FontAwesomeIcon icon='user-circle' className="icon" />
            }
            title="Me"
            key="Me"
            selected={this.state.selectedTab === 'yellowTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'yellowTab',
              });
            }}
          >
            <UserTab/>
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

export { Tabs }


