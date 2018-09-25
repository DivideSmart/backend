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
      splitters: [],
      showAddSplittersModal: false,
      friends: [],
      files: [],
    }

    this.removeSplitter = (splitter) => {
      const newSplitters = this.state.splitters.filter(s => s.uuid != splitter.uuid)
      this.setState({
        splitters: newSplitters
      })
    }

    this.handleAmountChange = (e) => {
      this.setState({
        totalAmount: e.target.value,
      })
    }

    this.addPhoto = (file) => {
      this.tempFile = file
      this.imgReader.readAsDataURL(file)
    }

    this.updateReceipt = (content) => {
      this.setState({
        data: [
          { value: 0, label: 'Shiquasa Mojito', price: '4.90' },
          { value: 1, label: 'Cranberry Juice', price: '3.50' },
          { value: 2, label: 'Mountain Monster Curry', price: '24.00' },
        ]
      })
    }

    this.updateFriends = this.updateFriends.bind(this);
      
  }

  updateFriends(added_users) {
      var new_added_users = added_users.map(u => {
                                      var p = {uuid: u.id, 
                                               username: u.username,
                                               avatarUrl: u.avatarUrl}
                                      return p;})

      this.setState({
        splitters: new_added_users
      })
      console.log("AFTER UPDATE")
      console.log(added_users)
      console.log(new_added_users)
      console.log(this.state.splitters)

      var ref_ids = added_users.map(u => u.id);

      var friends = this.state.friends.map(friend => {
        if (ref_ids.includes(friend.id) ){
          friend.selected = true
        } else {
          friend.selected = false
        }

        friend.pk = friend.id;
        return friend;
      })
      this.setState({
        friends: friends
      })
  }
  
  componentWillMount() {
    axios.get("/api/user").then(response => {
          this.setState({
            current_user: response.data
          })

          axios.get('/api/user/friends').then(responseB => {
            var friends = responseB.data.friends;
            friends = friends.map(friend => {
              friend.pk = friend.id;
              return friend;
            })
            this.setState({
              friends: friends
            })
          })

        })
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
          />
        </List>

        <WhiteSpace size="lg" />

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

        <WhiteSpace size="lg" />

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
                    <ListItemText style={{float: 'right'}} primary={splitter.username} />
                    <ListItemSecondaryAction>
                      <span
                        // className={'other-owe-amount'}
                        style={{ marginRight: '6vw'}}
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
                      <Avatar alt="Remy Sharp" src="https://forums.dctp.ws/download/file.php?avatar=10907_1408814803.gif" />
                    </ListItemAvatar>
                    <ListItemText style={{float: 'right'}}  primary={splitter.username} />
                    <ListItemSecondaryAction>
                      <Input
                        id="adornment-amount"
                        // value={this.state.amount}
                        // onChange={this.handleChange('amount')}
                        style={{width: '16vw', marginRight: '6vw', bottom: '3px'}}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
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
                <MListItem button >
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
            variant="contained" color="secondary" size="large" style={{ width: '100%', height: 48 }}>
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
          title="Settle up"
          // footer={[{ text: 'Ok', onPress: () => { console.log('ok'); this.onClose('modal1')(); } }]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div >
            <FriendList 
              mode='multi-select' 
              users={this.state.friends} 
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
