import 'regenerator-runtime/runtime'

import { Badge, List, SearchBar, WhiteSpace } from 'antd-mobile'

import React from 'react'
import Close from '@material-ui/icons/Close';
import {FriendsList} from './shared_components/friends_list.jsx'
import axios from 'axios'

const Item = List.Item
const Brief = Item.Brief

class GroupHistoryTab extends React.Component {
  constructor() {
    super()
    this.state = {
      disabled: false,
    }
  }

  componentWillMount() {
    // axios.get()
  }

  render() {
    return (
      <div>
        <SearchBar placeholder="Search" maxLength={8} cancelText={<Close style={{minHeight: 44}} />} />
        
    </div>)
  }
}

export { GroupHistoryTab }
