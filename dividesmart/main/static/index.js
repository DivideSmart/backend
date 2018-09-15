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
    }
  }

  componentDidMount() {
    axios.get('/api/user').then(response => {
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
                    path={'/u/:userPk/friend_list'}
                    render={ ({match, location}) =>
                      <FriendList/>
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
                        <GroupCreate />
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
    )
  }
}

ReactDOM.render(
  <LocaleProvider locale={enUS}>
    <App />
  </LocaleProvider>,
  document.getElementById('main')
)
