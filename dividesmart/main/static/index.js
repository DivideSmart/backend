import 'regenerator-runtime/runtime'
import './style/index.css'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'
import 'util.js'

import { WhiteSpace } from 'antd-mobile'
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux';
import { faChevronLeft, faDollarSign, faHome, faReceipt, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons'
import { logoutUser, setCurrentUser } from './redux/actions/authActions.js';

import {LoginPage} from './components/login.jsx'
import {CreateForm} from './components/create_form.jsx'
import FloatingButton from './components/material/material_float_btn.jsx'
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
import store from './redux/store';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Tabs2 } from './components/tabs2.jsx'

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
    this.updateUsers = this.updateUsers.bind(this);
    this.updateGroupInfo = this.updateGroupInfo.bind(this);
    this.findFriendList = this.findFriendList.bind(this);
  }

  componentWillMount() {
    axios.get('/api/user').then(response => {
      this.props.setCurrentUser(response.data)
      this.setState({
        user: response.data
      })
      axios.get('/api/users/{0}/friends'.format(this.state.user.id)).then(response => {
        this.setState({
          friends: response.data
        })
      })
    })
  }


  updateUsers(added_users) {
    this.setState({ users: added_users})
  }


  shouldComponentUpdate(nextProp, nextState) {
    if(JSON.stringify(nextProp) === JSON.stringify(this.props) &&
      JSON.stringify(nextState) === JSON.stringify(this.state)) {
      return false;
    } else {
      return true;
    }
  }


  updateGroupInfo(groupID) {
    axios.get('/api/groups/' + groupID).then(response => {
      if(JSON.stringify(response.data) !== JSON.stringify(this.state.name)) {
        this.setState({
          name: response.data.name
        })
      }
    })

    axios.get('/api/groups/' + groupID + '/members').then(response => {
      var count_user = response.data.members.length;
      if(JSON.stringify(response.data) !== JSON.stringify(this.state.name)) {
        this.setState({
          count_user: count_user
        })
      }
    } )
  }


  findFriendList(groupID) {
    axios.get('/api/groups/' + groupID + '/members').then(response => {
      this.setState({
        users: response.data.members
      })
    })
  }


  render() {
    return (
      <Router basename={''}>
        <Route render={({ location }) => (
          <div>
            <TopBar />
            <WhiteSpace />
            <WhiteSpace />
            <WhiteSpace />
            <WhiteSpace />
            <WhiteSpace />


            <TransitionGroup>
              <CSSTransition key={location.key} classNames="fade" timeout={380}>
                <Switch>
                  <Route
                    path={'/u/:group_id/friend_list'}
                    render={ ({match, location}) => {
                        this.findFriendList(match.params.group_id);
                        console.log(this.state.users);
                        return (<FriendList isCreateGroup={false} users={this.state.users}/>)
                      }
                    }
                  />

                  <Route
                    path={'/u/:userPk'}
                    render={ ({match, location}) =>
                      <div style={{ top: '6vh', position: 'relative' }}>
                        <UserTab
                          match={match}
                          location={location}

                        />
                        <FloatingButton />
                      </div>
                    }
                  />

                  <Route
                    path={'/loginPage'}
                    render={ ({match, location}) =>
                      <LoginPage
                        match={match}
                        location={location}
                      />
                    }
                  />

                  <Route
                    path={'/create'}
                    render={ ({match, location}) =>
                      <div style={{ top: '6vh', position: 'relative' }}>
                        <CreateForm
                          match={match}
                          location={location}
                        />
                      </div>
                    }
                  />

                  <Route
                    path={'/g/create'}
                    render={ ({match, location}) =>
                      <div>
                          <WhiteSpace />

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
                            <WhiteSpace size="xl"/>

                            <Tabs2 group_id={match.params.gPk}/>
                            {/* <FriendsTab /> */}
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
                        <FloatingButton />
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

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0060c0',
    },
    secondary: {
      main: '#0060c0',
    }
  },
  // status: {
  //   danger: 'orange',
  // },
})


const mapStoreToProps = (store, ownProps) => {
  return {...ownProps, user: store.user}
}
const AppWithRedux = connect(mapStoreToProps, {setCurrentUser})(App)

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={enUS}>
      <MuiThemeProvider theme={theme}>
        <AppWithRedux />
      </MuiThemeProvider>
    </LocaleProvider>
  </Provider>,
  document.getElementById('main')
)
