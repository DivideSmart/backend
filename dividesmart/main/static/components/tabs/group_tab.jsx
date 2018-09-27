import 'regenerator-runtime/runtime'

import { Badge, List, SearchBar } from 'antd-mobile';

import Avatar from '@material-ui/core/Avatar';
import Close from '@material-ui/icons/Close';
import Group from '@material-ui/icons/Group';
import {
  Link,
} from 'react-router-dom'
import MButton from '@material-ui/core/Button'
import People from '@material-ui/icons/People';
import PeopleOutline from '../../../../../node_modules/@material-ui/icons/PeopleOutline'
import React from 'react'
import axios from 'axios'
import store from '../../redux/store.js'

const Item = List.Item;
const Brief = Item.Brief;

function copy(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
      v = o[key];
      output[key] = (typeof v === "object") ? copy(v) : v;
  }
  return output;
}

class GroupTab extends React.Component {
  constructor() {
    super()
    this.state = {
      disabled: false,
      groups: []
    }
  }

  // Need to discuss about definition of owe, owed and settled up.
  componentDidMount() {
      this.setState({
        groups: []
      });
      axios.get('/api/user/groups').then(response => {

        response.data.groups.map(group_entry => {
          var group_id = group_entry.id;
          console.log(group_id);
          axios.get('/api/groups/' + group_id.toString() + "/members").then(responseA => {

            var positiveDebt = responseA.data.members.reduce((x, y) => {
                return parseFloat(y.debt) > 0 
                          ? x + parseFloat(y.debt)
                          : x
                }, 0);

            var negativeDebt = responseA.data.members.reduce((x, y) => {
                return parseFloat(y.debt) < 0 
                          ? x + parseFloat(y.debt)
                          : x
                }, 0);

              
            // This check is not correct in some sense, need to discuss
            var newArray = [];
            group_entry.positiveDebt = parseFloat(positiveDebt).toString();
            group_entry.negativeDebt = (-parseFloat(negativeDebt)).toString();
            newArray = copy(this.state.groups);
            newArray.push(group_entry);
              
            this.setState({
              groups: newArray
            }) 
            console.log(this.state.groups);
          })
        } );
      })
  }

  render() {
    return (
    <div>
      <SearchBar placeholder="Search" maxLength={8} cancelText={<Close style={{minHeight: 44}} />} />
      <List renderHeader={() => 'Groups'} className="my-list">
        {
          this.state.groups.map(group => {
            return (
              <Link key={group.id} to={"g/" + (group.id)} onClick={e => e.stopPropagation()}>
                <Item
                  key={group.id}
                  arrow="horizontal"
                  thumb={
                    <Badge>
                      {/*<Group*/}
                        {/*style={{*/}
                          {/*width: '48px',*/}
                          {/*height: '48px',*/}
                          {/*display: 'inline-block' }}*/}
                      {/*/>*/}
                      <Avatar style={{ color: '#1e88e5', backgroundColor: '#bbdefb' }}>
                        <People />
                      </Avatar>
                    </Badge>
                  }
                  multipleLine
                  // onClick={() => { window.location.href = '/u/1'}}
                  extra={
                    <div>
                      <div>
                        <span style={{ color: '#dc143c', display:'inline-block', vertical_align:'middle' }}></span>
                      </div>
                      <div>
                        <span style={{ color: '#00b894', display:'inline-block', vertical_align:'middle' }}></span>
                      </div>
                    </div>
                  }
                >
                  {group.name} <Brief>{group.lastActivityDate}</Brief>
                </Item>
              </Link>
            )
          })
        }
      </List>

      <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 38,
        }}
      >
        <Link aria-label="create-group" to='/g/create' style={{ width: '80%' }}>
          <MButton
            aria-label="add-friends"
            variant="contained" color="secondary" size="large" style={{ width: '100%', height: 38 }}>
            <PeopleOutline style={{ marginRight: 18 }} />
            <span style={{ marginTop: 3 }}>
              Create Group
            </span>
          </MButton>
        </Link>
      </div>
    </div>)
  }
}

export { GroupTab }
