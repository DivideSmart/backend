import { ListView, SearchBar, TabBar } from 'antd-mobile';

import Close from '@material-ui/icons/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {FriendsList} from './tabs/shared_components/friends_list.jsx'
import { FriendsTab } from './tabs/friends_tab.jsx'
import { GroupHistoryTab } from './tabs/group_history_tab.jsx'
import React from 'react'
import axios from 'axios'

class Tabs2 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'blueTab',
      hidden: false,
      members: { friendsOweYou: [], friendsYouOwe: [], friendsSettledUp: [] },
      users: {}
    };
  }

  componentWillMount() {
    axios.get('/api/groups/' + this.props.group_id.toString() + "/members").then(responseA => {

      var details = { friendsOweYou: [], friendsYouOwe: [], friendsSettledUp: [] };
      var users = {};
      responseA.data.members.forEach( person => {

        users[person.id] = person.username;
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
        members: details,
        users: users
      })
      console.log(this.state.users);


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
            icon={
              <FontAwesomeIcon icon='landmark' style={{ marginBottom: 3, marginTop: 3, width: 24, height: 24}} />
            }
            selectedIcon={
              <FontAwesomeIcon icon='landmark' style={{ marginBottom: 3, marginTop: 3, width: 24, height: 24}} />
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
            <GroupHistoryTab group_id={this.props.group_id} users={this.state.users}/>
          </TabBar.Item>

        </TabBar>
      </div>
    );
  }
}

export { Tabs2 }


