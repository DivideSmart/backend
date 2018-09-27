import 'regenerator-runtime/runtime'
import './style/index.less'
import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'
import 'util.js'

import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider, connect } from 'react-redux';
import {
  faChevronLeft,
  faDollarSign,
  faHandHoldingUsd,
  faHome,
  faLandmark,
  faMoneyBillAlt,
  faPenNib,
  faReceipt,
  faSignOutAlt,
  faUserCircle,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { logoutUser, setCurrentUser } from './redux/actions/authActions.js';
import { Icon, NavBar } from 'antd-mobile'
import {AddFriend} from './components/add_friend.jsx'
import {CreateForm} from './components/create_form.jsx'
import FloatingButton from './components/material/material_float_btn.jsx'
// import { FriendList } from './components/tabs/friend_list.jsx'
// import { FriendsTab } from './components/tabs/friends_tab.jsx'
import {GroupCreate} from './components/group_create.jsx'
import { GroupInfoTab } from './components/tabs/group_info_tab.jsx';
import { LocaleProvider } from 'antd-mobile';
import { MultiSelectFriend } from './components/tabs/multi_select_friend.jsx';
import React from 'react'
import ReactDOM from 'react-dom'
import { Tabs } from './components/tabs.jsx'
import { Tabs2 } from './components/tabs2.jsx'
import { TopBar } from './components/topbar.jsx'
import {UserTab} from './components/tabs/user_tab2.jsx'
import { WhiteSpace } from 'antd-mobile'
import axios from 'axios'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import { library } from '@fortawesome/fontawesome-svg-core'
import store from './redux/store';
import Snackbar from '@material-ui/core/Snackbar';
import { MySnackbarContentWrapper } from './components/alert_message.jsx'

library.add(
  faPenNib,
  faMoneyBillAlt,
  faHandHoldingUsd,
  faDollarSign,
  faReceipt, faHome, faChevronLeft,
  faUsers, faUserCircle, faLandmark,  faSignOutAlt
)

class App extends React.Component {
  constructor() {
    super()

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'

    this.state = {
      users: [],
      count_user: 0,
      name: '',
      friends: [],
      splitters: [],
      groupMembers: [],
      open: false,
      message: '',
      variant: ''
    }
    this.updateUsers = this.updateUsers.bind(this);
    this.updateGroupInfo = this.updateGroupInfo.bind(this);
    this.findFriendList = this.findFriendList.bind(this);
    this.findFriend = this.findFriend.bind(this);
    this.findGroupMembers = this.findGroupMembers.bind(this);
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  componentWillMount() {
    const self = this
    axios.get('/api/user').then(response => {
      this.props.setCurrentUser(response.data)
      this.setState({
        user: response.data
      })
      axios.get('/api/user/friends').then(response => {
        this.setState({
          friends: response.data
        })
      })
    })
    window.addEventListener('online', function (event) {
      self.setState({ open: true, message: 'Back Online', variant: 'success'})
    }, false);

    window.addEventListener('offline', function (event) {
      self.setState({ open: true, message: 'Offline mode', variant: 'warning'})
    }, false);
  }

  updateUsers(added_users) {
    this.setState({ users: added_users})
  }

  shouldComponentUpdate(nextProp, nextState) {
    if (JSON.stringify(nextProp) === JSON.stringify(this.props) &&
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

  findFriend(user_id) {
    axios.get('/api/user/friends/' + user_id + '/')
    .then(response => {
      this.setState({
        splitters: [response.data]
      })
    })
  }

  findGroupMembers(group_id) {
    axios.get('/api/groups/' + group_id + '/members/')
    .then(response => {
      var newMembers = response.data.members;
      this.setState({
        groupMembers: newMembers
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
                        // this.findFriendList(match.params.group_id);
                        // console.log(this.state.users);
                        // return (<FriendList isCreateGroup={false} users={this.state.users}/>)
                        return (
                          <div className="top-position">
                            <MultiSelectFriend group_id={match.params.group_id} isAddGroup={true}/>
                          </div>
                        )
                      }
                    }
                  />

                  <Route
                    path={'/u/:userPk/create-bill/'}
                    render={ ({match, location}) =>
                      <div className="top-position">
                        {this.findFriend(match.params.userPk)}
                        <CreateForm
                          match={match}
                          location={location}
                          splitters={this.state.splitters}
                        />
                      </div>
                    }
                  />

                  <Route
                    path={'/g/:gPk/create-bill'}
                    render={ ({match, location}) =>
                      <div className="top-position">
                        {this.findGroupMembers(match.params.gPk)}
                        <CreateForm
                          match={match}
                          location={location}
                          splitters={this.state.groupMembers}
                          friends={this.state.groupMembers}
                        />
                      </div>
                    }
                  />

                  <Route
                    path={'/u/:userPk'}
                    render={ ({match, location}) =>
                      <div className="top-position">
                        <UserTab
                          match={match}
                          location={location}
                        />
                        <FloatingButton user_id={match.params.userPk} prefix='/u/'/>
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
                      <div className="top-position">
                        <CreateForm
                          match={match}
                          location={location}
                        />
                      </div>
                    }
                  />

                  <Route
                    path={'/addfriend'}
                    render={ ({match, location}) =>
                      <div className="top-position">
                        <AddFriend
                          match={match}
                          location={location}
                        />
                      </div>
                    }
                  />

                  <Route
                    path={'/g/create'}
                    render={ ({match, location}) =>
                      <div className="top-position">
                          <GroupCreate users = {this.state.users} />
                      </div>
                    }
                  />

                  <Route
                    path={'/g/:gPk'}
                    render={ ({match, location}) => {
                        this.updateGroupInfo(match.params.gPk);
                        return (
                          <div style={{ top: '6vh', position: 'relative'}}>
                            <GroupInfoTab groupID={match.params.gPk} name={this.state.name} count_user={this.state.count_user}/>
                            <WhiteSpace size="xl"/>

                            <Tabs2 group_id={match.params.gPk}/>
                            {/* <FriendsTab /> */}
                            <FloatingButton user_id={match.params.gPk} prefix='/g/'/>
                          </div>
                        )
                      }
                    }
                  />

                  <Route
                    path={'/'}
                    render={ ({match, location}) =>
                      <div style={{ top: '6vh', position: 'relative', height: '100%'}}>
                        <Tabs />
                        <FloatingButton />
                      </div>
                    }
                  />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
            <Snackbar anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
              open={this.state.open}
              autoHideDuration={3000}
              onClose={this.handleClose}
            >
              <MySnackbarContentWrapper
                onClose={this.handleClose}
                variant={this.state.variant}
                message={this.state.message}
              />
            </Snackbar>
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
