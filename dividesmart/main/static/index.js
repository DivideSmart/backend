import 'regenerator-runtime/runtime'
import './css/index.css'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'

import {
  Link,
  Route,
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'

import FlaoatingButton from './components/material/material_float_btn.jsx'
import { LocaleProvider } from 'antd-mobile';
import React from 'react'
import ReactDOM from 'react-dom'
import { Tabs } from './components/tabs.jsx'
import { TopBar } from './components/topbar.jsx'
import {UserTab} from './components/tabs/user_tab2.jsx'
import axios from 'axios'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { FriendsTab } from './components/tabs/friends_tab.jsx'
import { GroupInfoTab } from './components/tabs/group_info_tab.jsx';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  componentDidMount() {
    axios.get('/').then(response => {
      console.log(response.data)
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
                    path={'/u/:userPk'}
                    render={ ({match, location}) =>
                      <UserTab
                        match={match}
                        location={location}
                      />
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
