import 'regenerator-runtime/runtime'

import { Badge, List, SearchBar, WhiteSpace } from 'antd-mobile'

import React from 'react'
import Close from '@material-ui/icons/Close';
import {FriendsList} from './shared_components/friends_list.jsx'
import axios from 'axios'
import store from '../../redux/store.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Link,
} from 'react-router-dom'

const Item = List.Item
const Brief = Item.Brief

function copy(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
      v = o[key];
      output[key] = (typeof v === "object") ? copy(v) : v;
  }
  return output;
}

class GroupHistoryTab extends React.Component {
  constructor() {
    super()
    this.state = {
      disabled: false,
      entries: []
    }
    this.giveDescription = this.giveDescription.bind(this);
  }

  componentDidMount() {
    this.setState({
      entries: []
    })

    var entries = [];
    var currentUser = this.props.users[0];
    axios.get('/api/groups/' + this.props.group_id.toString() + "/entries").then(responseA => {
      responseA.data.entries.forEach(entry => {

        if(entry.type == 'payment') {
          entry.receiverName = this.props.users[entry.receiver];
          entry.initiatorName = this.props.users[entry.initiator];
          entries.push(entry);
        } else if(entry.type == 'bill') {
          
          Object.keys(entry.loans).forEach(receiver => {
            entry.receiverName = this.props.users[receiver];
            entry.receiver = receiver;
            entry.amount = entry.loans[receiver];
            entry.initiatorName = this.props.users[entry.initiator];
            entries.push(copy(entry));
          })
        }

      });
      this.setState({
        entries: entries
      });
    })

  }

  giveDescription(entry, currentUser) {
    var result = "";
    if(entry.initiator == currentUser) {
      result = "You -> " + entry.receiverName;
    } else {
      result = entry.initiatorName + " -> You";
    }

    return result;
  }

  formatDate(entry) {
    var dateObj = new Date(entry.dateCreated);
    return (dateObj.getMonth() + 1).toString() + "/" 
            + dateObj.getDate().toString() + "/" 
            + dateObj.getFullYear().toString();
  }

  formatLink(entry, currentUser) {
    if(entry.type == 'bill') {
      console.log("HEEEE");
      return (
        <Link to={"/bill/" + entry.id} style={{ color: 'black' }}>
          {this.giveDescription(entry, currentUser)} <Brief> {this.formatDate(entry)} </Brief>
        </Link>
      )
    } else {
      return (                      
        <div style={{ color: 'black' }}>
          {this.giveDescription(entry, currentUser)} <Brief> {this.formatDate(entry)} </Brief>
        </div>
      )
    }
  } 

  render() {
    return (
      <div>
        <SearchBar placeholder="Search" maxLength={8} cancelText={<Close style={{minHeight: 44}} />} />
        <List renderHeader={() => 'History'} className="my-list">
            {
              this.state.entries.map((entry, index) => {
                console.log(entry.dateCreated);
                var currentUser = store.getState().auth.user.id;
                if(entry.initiator == currentUser || entry.receiver == currentUser) {
                  return (
                    <Item
                      key={index}
                      thumb={
                        <FontAwesomeIcon icon='receipt' style={{ color: '#38b8f2', width: 24, height: 24}} />
                      }
                      multipleLine={true}
                      extra={<span className={entry.initiator == currentUser ? 'other-owe-amount' : 'owe-other-amount'}>${entry.amount}</span>}
                    >
                      {this.formatLink(entry, currentUser) }
                    </Item>
                    )
                  }
              })
            }
        </List>
    </div>)
  }
}

export { GroupHistoryTab }
