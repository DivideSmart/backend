import 'regenerator-runtime/runtime'
import './style/index.css'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'
import 'util.js'

import { CSSTransition, TransitionGroup } from "react-transition-group"
import {
  Link,
  Route,
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'
import { setCurrentUser, logoutUser } from './actions/authActions.js';

import { Provider, connect } from 'react-redux';
import store from './reducers/store';

import { faReceipt, faDollarSign, faHome, faChevronLeft, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons'

import FlaoatingButton from './components/material/material_float_btn.jsx'
import { FriendList } from './components/tabs/friend_list.jsx'
import { FriendsTab } from './components/tabs/friends_tab.jsx'
import {GroupCreate} from './components/group_create.jsx'
import { GroupInfoTab } from './components/tabs/group_info_tab.jsx';
import { LocaleProvider } from 'antd-mobile';
import React from 'react'
import ReactDOM from 'react-dom'
import { Tabs } from './components/tabs.jsx'
import { TopBar } from './components/topbar.jsx'
import {UserTab} from './components/tabs/user_tab2.jsx'
import axios from 'axios'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add([faDollarSign, faReceipt, faHome, faChevronLeft, faUsers, faUserCircle])


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      users: [],
      count_user: 0,
      name: '',
      friends: []
    }
    console.log("ACTUAL HERE");
    this.updateUsers = this.updateUsers.bind(this);
    this.updateGroupInfo = this.updateGroupInfo.bind(this);
    this.findFriendList = this.findFriendList.bind(this);
  }

  componentWillMount() {
    axios.get('/api/user').then(response => {
      localStorage.setItem('userPk', response.data.pk);
      store.dispatch(setCurrentUser(response.data));
      this.setState({
        user: response.data
      })
      axios.get('/api/users/{0}/friends'.format(this.state.user.pk)).then(response => {
        this.setState({
          friends: response.data
        })
        console.log(this.state)
      })
    })
  }

  updateUsers(added_users) {
    this.setState({ users: added_users})
  }

  updateGroupInfo(groupID) {
    axios.get('/api/groups/' + groupID).then(response => {
      this.setState({
        name: response.data
      })
    })

    axios.get('/api/groups/' + groupID + '/members').then(response => {
      var count_user = response.data.members.length;
      this.setState({
        count_user: count_user
      })
    } )
  }

  findFriendList(groupID) {
    axios.get('/api/groups/' + groupID + '/members').then(response => {
      this.setState({
        friends: response.data.members
      })
    })
  }

  render() {
    return (
      <Router basename={''}>
        <Route render={({ location }) => (
          <div>
            <TopBar />
            <TransitionGroup>
              <CSSTransition key={location.key} classNames="fade" timeout={380}>
                <Switch>
                  <Route
                    path={'/u/:group_id/friend_list'}
                    render={ ({match, location}) => {
                        this.findFriendList(match.params.group_id);
                        return (<FriendList users={this.state.friends}/>)
                      }
                    }
                  />

                  <Route
                    path={'/u/:userPk'}
                    render={ ({match, location}) =>
                      <div>
                        <UserTab
                          match={match}
                          location={location}
                        />
                        <FlaoatingButton />
                      </div>
                    }
                  />

                  <Route
                    path={'/g/create'}
                    render={ ({match, location}) =>
                      <div>
                        <GroupCreate users = {this.state.users} />
                      </div>
                    }
                  />

                  <Route
                    path={'/g/:gPk'}
                    render={ ({match, location}) => {
                        this.updateGroupInfo(match.params.gPk);
                        return (
                          <div>
                            <GroupInfoTab groupID={match.params.gPk} name={this.state.name} count_user={this.state.count_user}/>
                            <FriendsTab />
                          </div>
                        )
                      }
                    }
                  />

                  <Route
                    path={'/'}
                    render={ ({match, location}) =>
                      <div>
                        <Tabs />
                        <FlaoatingButton />
                      </div>
                    }
                  />


                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </div>
        )} />
      </Router>
    )
  }
}

const mapStoreToProps = (store, ownProps) => {
  return {...ownProps, user: store.user}
}
const AppWithRedux = connect(mapStoreToProps)(App)

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={enUS}>
      <AppWithRedux />
    </LocaleProvider>
  </Provider>,
  document.getElementById('main')
)
