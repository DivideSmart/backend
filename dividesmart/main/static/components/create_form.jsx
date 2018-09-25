import 'regenerator-runtime/runtime'
import '../style/index.less'

import {
  Badge,
  Button,
  Card,
  Checkbox,
  Flex,
  Icon,
  InputItem,
  List,
  Modal,
  Radio,
  Result,
  Tabs,
  TextareaItem,
  WhiteSpace,
  ImagePicker,
  WingBlank,
} from 'antd-mobile'

import AddIcon from '@material-ui/icons/Add';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Avatar from '@material-ui/core/Avatar';
import CommentIcon from '@material-ui/icons/Comment';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import {Link} from "react-router-dom";
import ListItem from 'antd-mobile/lib/list/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import MButton from '@material-ui/core/Button';
import MCheckbox from '@material-ui/core/Checkbox';
import MList from '@material-ui/core/List';
import MListItem from '@material-ui/core/ListItem';
import MListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import PersonIcon from '@material-ui/icons/Person';
import PersonOutline from '@material-ui/icons/PersonOutline';
import React from 'react'
import ReceiptButton from './material/receipt_float_btn.jsx'
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { createForm } from 'rc-form';
import { withStyles } from '@material-ui/core/styles';
import { FriendList } from './tabs/friend_list.jsx'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import axios from 'axios';
const RadioItem = Radio.RadioItem;
const CheckboxItem = Checkbox.CheckboxItem

const Item = List.Item
const Brief = Item.Brief


const AgreeItem = Checkbox.AgreeItem;
const myImg = src => < img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" style={{ width: 60, height: 60 }} alt="" />;


const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);


function copy(o) {
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
      v = o[key];
      output[key] = (typeof v === "object") ? copy(v) : v;
  }
  return output;
}

let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

const tabs = [
  { title: 'Split Equally', sub: '1' },
  { title: 'Split Unequally', sub: '2' },
];

class H5NumberInputExample extends React.Component {
  constructor(props) {
    super()
    this.imgReader = new FileReader()
    this.tempFile = undefined
    const self = this

    this.imgReader.addEventListener("load", function() {
      const url = self.imgReader.result
      const newFiles = self.state.files
      const file = this.tempFile
      newFiles.push({
        file: file,
        url: url
      })
      self.setState({
        files: newFiles,
      })
    }, false);

    this.state = {
      current_user: '',
      totalAmount: 0,
      splitMode: 'equally',
      payer: undefined,
      splitters: [],  // selected splitters
      showAddSplittersModal: false,
      friends: [],  // all friends of this user, with an attribute indicate whether selected or not
      files: [],
      splitterToAmount: {},
      name: ''
    }

    this.removeSplitter = (splitter) => {
      const newSplitters = this.state.splitters.filter(s => s.uuid != splitter.uuid)
      const friends = this.state.friends.map(friend => {
        if (friend.id == splitter.uuid)
          friend.selected = false
        friend.pk = friend.id
        return friend
      })

      this.setState({
        splitters: newSplitters,
        friends: friends
      })
    }

    this.handleAmountChange = (e) => {
      this.setState({
        totalAmount: e.target.value,
      })
    }

    this.handleNameChange = (e) => {
      this.setState({
        name: e,
      })
    }

    this.getUpdatedFriendsBySplitters = () => {
      var ref_ids = this.state.splitters.map(u => u.uuid);
      var tempFriendsList = this.state.friends.map(friend => {
        friend.selected = ref_ids.includes(friend.id)
        friend.pk = friend.id
        return friend
      })
      return tempFriendsList
    }

    this.addPhoto = (file) => {
      this.tempFile = file
      this.imgReader.readAsDataURL(file)
    }
    this.updateReceipt = (content) => {}

    this.updateFriends = this.updateFriends.bind(this);
    this.postBill = this.postBill.bind(this);

    this.updateIndividualAmount = (e) => {
      var user_id = e.target.name;
      console.log(this.state.splitterToAmount)
      // var newSplitterToAmount = this.state.splitterToAmount.map(splitter => {
      //                               if(splitter.id == user_id) {
      //                                 splitter.amount = e.target.value;
      //                               }
      //                           })
      var newSplitterToAmount = this.state.splitterToAmount;
      newSplitterToAmount[user_id] = e.target.value
      this.setState({
        splitterToAmount: newSplitterToAmount
      })
    }
  }

  // updateIndividualAmount(e) {
  //   console.log("UPDATE")
  //   console.log(e)
  //   console.log(e.target)
  //   console.log(e.target.name)
  //   var user_id = e.target.name;
  //   console.log(this.state.splitterToAmount)
  //   var newSplitterToAmount = this.state.splitterToAmount.map(splitter => {
  //                                 if(splitter.id == user_id) {
  //                                   splitter.amount = e.target.value;
  //                                 }
  //                             })
  //   this.setState({
  //     splitterToAmount: newSplitterToAmount
  //   })
  // }

  updateFriends(added_users) {
    var newSplitters = added_users.map(u => {
      return {
        uuid: u.id,
        username: u.username,
        avatarUrl: u.avatarUrl
      }
    })
    this.setState({
      splitters: newSplitters,
      showAddSplittersModal: false,
    })
  }

  postBill() {
    var formatSplitterToAmount = this.state.splitterToAmount;

    if(this.state.splitMode == "equally") {
      var keys = this.state.splitters.map(splitter => splitter.uuid);
      var equalAmount = this.state.totalAmount / (keys.length)
      keys.forEach(key => formatSplitterToAmount[key] = equalAmount.toString())
    }
    delete formatSplitterToAmount[this.state.current_user.id]

    var payload = {
      "name": this.state.name,
      "groupId": null,
      "initiator": this.state.current_user.id,
      "loans": formatSplitterToAmount,
      "amount": this.state.totalAmount,
    }

    if(this.props.match && this.props.match.params.gPk) {
      payload.groupId = this.props.match.params.gPk;
    }

    axios.post('/api/bills/', payload)
    .then(response => {
      console.log("RESPONSE")
      console.log(response)
    })
  }

  componentDidMount() {
    axios.get("/api/user").then(response => {
      var thisUser = response.data
      this.setState({ current_user: thisUser })

      if (this.props.friends) {
        var friends = this.props.friends.filter(friend => friend.id != response.data.id);
        friends.forEach(friend => {
          friend.pk = friend.id
          friend.selected = true
        })
        friends.push(thisUser);
        this.setState({ friends: friends })
      } else {
        axios.get('/api/user/friends').then(responseB => {
          var friends = responseB.data.friends;
          friends.forEach(friend => {
            friend.pk = friend.id
            friend.selected = true
          })
          friends.push(thisUser);
          this.setState({ friends: friends })
        })
      }
    })
  }
    // var new_added_users = added_users.map(u => {
    //   var p = {uuid: u.id,
    //            username: u.username,
    //            avatarUrl: u.avatarUrl}
    //   return p;})

    // this.setState({
    //   splitters: new_added_users
    // })

    // this.setState({
    //   splitters:
    // })

  componentWillReceiveProps(nextProps) {
    if (nextProps.friends) {
      var friends = copy(nextProps.friends);
      friends.forEach(friend => {friend.pk = friend.id; friend.selected = true})
      this.setState({
        friends: friends
      })
    }
    if (nextProps.splitters) {
      var newSplitters = nextProps.splitters.map(splitter => { return {
        uuid: splitter.id,
        username: splitter.username,
        avatarUrl: splitter.avatarUrl
      }})
      this.setState({ splitters: newSplitters })
    }
  }

  render() {
    return (
      <div>
        <List className={'bill-desc'} renderHeader={() => 'Description'}>
          <TextareaItem

            // title={<FontAwesomeIcon icon='pen-nib' style={{ width: 18, height: 18}} />}
            placeholder="Enter a description"
            data-seed="logId"
            ref={el => this.autoFocusInst = el}
            autoHeight
            onChange={this.handleNameChange}
          />
        </List>

        {/* <WhiteSpace size="lg" /> */}

        <List className={'divide-list'} renderHeader={() => (
          <span>
            <span>Pay by</span>
          </span>
        )}>
          {/*<InputItem*/}
            {/*{...getFieldProps('money3')}*/}
            {/*type={type}*/}
            {/*defaultValue={100}*/}
            {/*placeholder="start from left"*/}
            {/*clear*/}
            {/*moneyKeyboardWrapProps={moneyKeyboardWrapProps}*/}
            {/*extra="$"*/}
          {/*>*/}
            {/*<span style={{bottom: 8}}>Amount</span>*/}
            {/*/!*<Avatar alt="Remy Sharp" src="https://forums.dctp.ws/download/file.php?avatar=10907_1408814803.gif" />*!/*/}
          {/*</InputItem>*/}
        </List>
        <Paper elevation={0}>
          <MList>
            <MListItem button style={{marginBottom: 6}}>
              <ListItemAvatar>
                <AttachMoney />
              </ListItemAvatar>
              <ListItemText primary="Total Amount" />
              <ListItemSecondaryAction>
                <Input
                  id="adornment-amount"
                  type='number'
                  value={this.state.totalAmount}
                  onChange={this.handleAmountChange}
                  style={{width: '24vw', marginRight: '8vw', bottom: '3px'}}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                />
              </ListItemSecondaryAction>
            </MListItem>

            <MListItem button >
              <ListItemAvatar>
                <PersonOutline />
              </ListItemAvatar>
              <ListItemText primary="Pay by" />
              <Avatar
                alt="Remy Sharp"
                style={{height: 28, width: 28}}
                src={this.state.current_user.avatarUrl}
              />
              <span
                style={{marginRight: '8vw', marginLeft: '2vw'}}
              >
                <Typography variant="caption">
                  {this.state.current_user.username}
                </Typography>
              </span>
            </MListItem>
          </MList>
        </Paper>

        {/* <WhiteSpace size="lg" /> */}

        <List renderHeader={() => (
          <span>
            <span>Split by</span>
          </span>
        )}>
        </List>
        <Tabs tabs={tabs}
          initialPage={0}
          onChange={(tab, index) => {
            this.setState({
              splitMode: tab.sub == '1' ? 'equally' : 'unequally'
            })
          }}
        >
          <div>
            <Paper elevation={0}>
              <MList>
                {this.state.splitters.map(splitter => (
                  <MListItem button key={splitter.uuid} style={{marginBottom: 8}}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={splitter.avatarUrl} />
                    </ListItemAvatar>
                    <ListItemText style={{float: 'right'}} primary={splitter.uuid == this.state.current_user.id ? 'You' : splitter.username} />
                    <ListItemSecondaryAction>
                      <span style={{ marginRight: '6vw'}}
                        // className={'other-owe-amount'}
                      >
                        { parseFloat(this.state.totalAmount / this.state.splitters.length).toFixed(3) }
                      </span>
                      <IconButton aria-label="Comments">
                        <RemoveCircleOutline
                          style={{ color: '#d35400', width: 18, height: 18}}
                          onClick={() => this.removeSplitter(splitter)}
                        />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </MListItem>
                ))}
                <MListItem
                  onClick={() => this.setState({showAddSplittersModal: true})}
                  button
                >
                  <ListItemAvatar>
                    <Avatar>
                      <AddIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Add people" />
                </MListItem>
              </MList>
            </Paper>
          </div>
          <div>
            <Paper elevation={0}>
              <MList>
                {this.state.splitters.map(splitter => (
                  <MListItem button key={splitter.uuid} style={{marginBottom: 8}}>
                  <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={splitter.avatarUrl} />
                    </ListItemAvatar>
                    <ListItemText style={{float: 'right'}}  primary={splitter.username} />
                    <ListItemSecondaryAction>
                      <Input
                        id="adornment-amount"
                        name={splitter.uuid}
                        // value={this.state.amount}
                        // onChange={this.handleChange('amount')}
                        style={{width: '16vw', marginRight: '6vw', bottom: '3px'}}
                        onChange={this.updateIndividualAmount}
                        startAdornment={<InputAdornment position="start"
                        >$</InputAdornment>}
                      />
                      <IconButton aria-label="Comments">
                        <RemoveCircleOutline
                          style={{ color: '#d35400', width: 18, height: 18}}
                          onClick={() => this.removeSplitter(splitter)}
                        />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </MListItem>
                ))}
                <MListItem
                  button
                  onClick={() => this.setState({showAddSplittersModal: true})}
                >
                  <ListItemAvatar>
                    <Avatar> <AddIcon /> </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Add people" />
                </MListItem>
              </MList>
            </Paper>
          </div>
        </Tabs>


        <div style={{display: this.state.files.length > 0 ? 'block' : 'none'}}>
          <WhiteSpace size="lg" />

          <List renderHeader={() => (
            <span>
              <span>Images</span>
            </span>
          )}>
          </List>
          <ImagePicker
            files={this.state.files}
            onChange={(files, type, index) => {
              this.setState({
                files,
              });
            }}
            onImageClick={(index, fs) => console.log(index, fs)}
            accept="image/gif,image/jpeg,image/jpg,image/png"
          />
        </div>

        <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '8vh'
          }}
        >
          <MButton
            variant="contained" color="secondary" size="large" style={{ width: '100%', height: 48 }}
            onClick={() => this.postBill()}>
            <Icon type={'check-circle-o'} style={{marginRight: 18}}/> Save
          </MButton>
        </div>

        <ReceiptButton addPhoto={this.addPhoto} updateReceipt={this.updateReceipt}/>

        <Modal
          visible={this.state.showAddSplittersModal}
          transparent
          maskClosable={true}
          ref="modal_ref"
          onClose={() => this.setState({ showAddSplittersModal: false })}
          // title=""
          // footer={[{ text: 'Ok', onPress: () => { console.log('ok'); this.onClose('modal1')(); } }]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div>
            <FriendList
              mode='multi-select'
              users={this.getUpdatedFriendsBySplitters()}
              updateUsers = {this.updateFriends}
            />
            <WhiteSpace />
          </div>
        </Modal>
      </div>
    );
  }
}

const CreateForm = createForm()(H5NumberInputExample);

export { CreateForm }
