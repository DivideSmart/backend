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

import { Provider } from 'react-redux';
import store from './store.js';

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

// store.dispatch(setCurrentUser({CU: '1'}));

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      users: []
    }
    console.log("ACTUAL HERE");
    this.updateUsers = this.updateUsers.bind(this);

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

  render() {
    return (
      <Provider locale={enUS} store={store}>
        <Router basename={''}>
          <Route render={({ location }) => (
            <div>
              <TopBar />
              {
                console.log("HEHE")
              }
              {
                console.log(this.props)
              }
              <TransitionGroup>
                <CSSTransition key={location.key} classNames="fade" timeout={380}>
                  <Switch>
                    <Route
                      path={'/u/:userPk/friend_list/:isCreateGroup'}
                      render={ ({match, location}) =>
                        <FriendList updateUsers = {this.updateUsers}/>
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
                      render={ ({match, location}) =>
                        <div>
                          <GroupInfoTab name = "Buddy Group CS3216" count_users = "12"/>
                          <FriendsTab />
                        </div>
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
      </Provider>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('main')
)
