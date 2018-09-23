import { ListView, TabBar, SearchBar } from 'antd-mobile';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FriendsTab } from './tabs/friends_tab.jsx'
import React from 'react'
import { GroupHistoryTab } from './tabs/group_history_tab.jsx'
import {FriendsList} from './tabs/shared_components/friends_list.jsx'
import axios from 'axios'
import Close from '@material-ui/icons/Close';

class Tabs2 extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'blueTab',
      hidden: false,
      members: { friendsOweYou: [], friendsYouOwe: [], friendsSettledUp: [] }
    };
  }

  componentWillMount() {
    axios.get('/api/groups/' + this.props.group_id.toString() + "/members").then(responseA => {

      var details = { friendsOweYou: [], friendsYouOwe: [], friendsSettledUp: [] };

      responseA.data.members.forEach( person => {
        
        if(person.debt) {
          person.name = person.username;
          person.avatarUrl = 'https://www.osustuff.org/img/avatars/2017-04-22/211652.jpg';
          person.key = person.id;
          person.acc = parseFloat(person.debt);
          if(parseFloat(person.debt) > 0) {
            details.friendsOweYou.push(person);
          } else if(parseFloat(person.debt) < 0) {
            person.acc = -person.acc;
            details.friendsYouOwe.push(person);
          } else {
            details.friendsSettledUp.push(person);
          }
        }

      })

      this.setState({
        members: details
      })

      
    })
  }

  render() {
    return (
      <div>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#0060c0"
          barTintColor="white"
          tabBarPosition="top"
          hidden={this.state.hidden}
          prerenderingSiblingsNumber={0}
        >
          <TabBar.Item
            title="Summary"
            key="Summary"
            icon={
              <FontAwesomeIcon icon='home' style={{ marginBottom: 3, marginTop: 3, width: 24, height: 24}} />
            }
            selectedIcon={
              <FontAwesomeIcon icon='home' style={{ marginBottom: 3, marginTop: 3, width: 24, height: 24}} />
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
            <SearchBar placeholder="Search" maxLength={8} cancelText={<Close style={{minHeight: 44}} />} />
            <FriendsList friends={this.state.members}/>
          </TabBar.Item>

          <TabBar.Item
            icon={
              <FontAwesomeIcon icon='users' style={{ marginBottom: 3, marginTop: 3, width: 24, height: 24}} />
            }
            selectedIcon={
              <FontAwesomeIcon icon='users' style={{ marginBottom: 3, marginTop: 3, width: 24, height: 24}} />
            }
            title="History"
            key="History"
            // badge={'new'}
            selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'redTab',
              });
            }}
            data-seed="logId1"
          >
            <GroupHistoryTab group_id={this.props.group_id}/>
          </TabBar.Item>

        </TabBar>
      </div>
    );
  }
}

export { Tabs2 }


