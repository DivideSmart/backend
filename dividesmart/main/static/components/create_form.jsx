import 'regenerator-runtime/runtime'

import {
  Badge,
  Button,
  Card,
  Checkbox,
  Flex,
  Icon,
  InputItem,
  List,
  Radio,
  Result,
  Tabs,
  WhiteSpace,
  WingBlank,
  TextareaItem,
} from 'antd-mobile'

import ListItem from 'antd-mobile/lib/list/ListItem';
import React from 'react'
import ReceiptButton from './material/receipt_float_btn.jsx'
import { createForm } from 'rc-form';
import '../style/index.less'
const RadioItem = Radio.RadioItem;
const CheckboxItem = Checkbox.CheckboxItem
import MButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const Item = List.Item
const Brief = Item.Brief


const AgreeItem = Checkbox.AgreeItem;
const myImg = src => < img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" style={{ width: 60, height: 60 }} alt="" />;


const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);

import MList from '@material-ui/core/List';
import MListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import MCheckbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {Link} from "react-router-dom";
import PersonIcon from '@material-ui/icons/Person';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MListItemIcon from '@material-ui/core/ListItemIcon';
import AttachMoney from '@material-ui/icons/AttachMoney';
import PersonOutline from '@material-ui/icons/PersonOutline';
import Typography from '@material-ui/core/Typography';

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



const emails = ['Harry', 'Oscar'];


class H5NumberInputExample extends React.Component {
  constructor(props) {
    super()
    this.state = {
      type: 'money',
      data: [],

      value: 0,
      value2: 0,
      value3: 0,
      value4: 0,
    }

    this.onChange = () => {

    }

    this.onChange2 = (value) => {
      console.log('checkbox');
      this.setState({
        value2: value,
      });
    };

    this.updateReceipt = (content) => {
      this.setState({
        data: [
          { value: 0, label: 'Shiquasa Mojito', price: '4.90' },
          { value: 1, label: 'Cranberry Juice', price: '3.50' },
          { value: 2, label: 'Mountain Monster Curry', price: '24.00' },
        ]
      })
    }
  }

  render() {
    const { classes } = this.props;
    const { getFieldProps } = this.props.form;
    const { type } = this.state;
    return (
      <div>
        {/*<WhiteSpace size="lg" />*/}

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
                  // value={this.state.amount}
                  // onChange={this.handleChange('amount')}
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
                src="https://forums.dctp.ws/download/file.php?avatar=10907_1408814803.gif"
              />
              <span
                style={{marginRight: '8vw', marginLeft: '2vw'}}
              >
                <Typography variant="caption">
                  Oscar
                </Typography>
              </span>
            </MListItem>
          </MList>
        </Paper>
        {/*<div >*/}
          {/*<Paper elevation={0}>*/}
            {/*<MList>*/}
              {/*{[0, 1, 2].map(value => (*/}
                {/*<div key={value}>*/}
                  {/*<MListItem key={value} dense button>*/}
                    {/*<Avatar alt="Remy Sharp" style={{width: 38, height: 38}} src="https://forums.dctp.ws/download/file.php?avatar=10907_1408814803.gif" />*/}
                    {/*<ListItemText primary={`Line item ${value + 1}`} />*/}
                    {/*<ListItemSecondaryAction>*/}
        
                      {/*<Input*/}
                        {/*id="adornment-amount"*/}
                        {/*// value={this.state.amount}*/}
                        {/*// onChange={this.handleChange('amount')}*/}
                        {/*style={{width: '16vw'}}*/}
                        {/*startAdornment={<InputAdornment position="start">$</InputAdornment>}*/}
                      {/*/>*/}
        
                    {/*</ListItemSecondaryAction>*/}
                  {/*</MListItem>*/}
                {/*</div>*/}
              {/*))}*/}
            {/*</MList>*/}
          {/*</Paper>*/}
        {/*</div>*/}


        {/*<div>*/}
          {/*<List renderHeader={() => 'test'} className="my-list">*/}
            {/*{*/}
              {/*friendsYouOwe.map(friend => (<List.Item*/}
              {/*key={friend.key}*/}
              {/*thumb={*/}
                {/*<Badge>*/}
                  {/*<span*/}
                    {/*style={{*/}
                      {/*width: '44px',*/}
                      {/*height: '44px',*/}
                      {/*background: 'url(' + friend.avatarUrl + ') center center /  44px 44px no-repeat',*/}
                      {/*display: 'inline-block' }}*/}
                  {/*/>*/}
                {/*</Badge>*/}
              {/*}*/}
              {/*multipleLine*/}
              {/*// onClick={() => { window.location.href = '/u/1'}}*/}
              {/*extra={*/}
                {/*<span className={'other-owe-amount'}>${ friend.acc }</span>*/}
              {/*}*/}
            {/*>*/}
              {/*{friend.name} <Brief></Brief>*/}
            {/*</List.Item>))*/}
            {/*}*/}
          {/*</List>*/}
        {/*</div>*/}

        {/*<List>*/}
          {/*<InputItem*/}
            {/*{...getFieldProps('inputtitle2')}*/}
            {/*placeholder="Enter names, emails or phones"*/}
          {/*>*/}
            {/*<div style={{ backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/DfkJHaJGgMghpXdqNaKF.png)', backgroundSize: 'cover', height: '22px', width: '22px' }} />*/}
          {/*</InputItem>*/}
        {/*</List>*/}

        {/*<WhiteSpace size="lg" />*/}

        <WhiteSpace size="lg" />

        <List renderHeader={() => (
          <span>
            <span>Split by</span>
          </span>
        )}>
        </List>
        <Tabs tabs={tabs}
          initialPage={0}
          onChange={(tab, index) => { console.log('onChange', index, tab); }}
          onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
        >
          <div>
            <Paper elevation={0}>
              <MList>
                {emails.map(email => (
                  <MListItem button key={email} style={{marginBottom: 8}}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src="https://forums.dctp.ws/download/file.php?avatar=10907_1408814803.gif" />
                    </ListItemAvatar>
                    <ListItemText style={{float: 'right'}}  primary={email} />
                    <ListItemSecondaryAction>
                      <Input
                        id="adornment-amount"
                        // value={this.state.amount}
                        // onChange={this.handleChange('amount')}
                        style={{width: '16vw', marginRight: '6vw', bottom: '3px'}}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                      />
                      <IconButton aria-label="Comments">
                        <RemoveCircleOutline style={{ color: '#d35400', width: 16, height: 16}} />
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
          <div>
            <Paper elevation={0}>
              <MList>
                {emails.map(email => (
                  <MListItem button key={email} style={{marginBottom: 8}}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src="https://forums.dctp.ws/download/file.php?avatar=10907_1408814803.gif" />
                    </ListItemAvatar>
                    <ListItemText style={{float: 'right'}}  primary={email} />
                    <ListItemSecondaryAction>
                      <span className={'other-owe-amount'}>$15</span>
                      <IconButton aria-label="Comments">
                        <RemoveCircleOutline style={{ color: '#d35400', width: 16, height: 16}} />
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


        {/* <Tabs tabs={tabs}
          initialPage={1}
          onChange={(tab, index) => { console.log('onChange', index, tab); }}
          onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
            Content of first tab
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
            Content of second tab
          </div>
        </Tabs> */}

        {/*<List className={'divide-list'}>*/}
            {/*{[0, 1, 2].map(value => (*/}
              {/*<InputItem*/}
                {/*key={value}*/}
                {/*{...getFieldProps('money3')}*/}
                {/*type={type}*/}
                {/*defaultValue={100}*/}
                {/*placeholder="start from left"*/}
                {/*clear*/}
                {/*moneyKeyboardAlign="left"*/}
                {/*moneyKeyboardWrapProps={moneyKeyboardWrapProps}*/}
                {/*extra="$"*/}
              {/*>*/}
                {/*<Avatar alt="Remy Sharp" src="https://forums.dctp.ws/download/file.php?avatar=10907_1408814803.gif" />*/}
              {/*</InputItem>*/}
            {/*))}*/}
        {/*</List>*/}




        {/*<div>*/}
          {/*<List renderHeader={() => 'CheckboxItem demo'}>*/}
            {/*{this.state.data.map(i => (*/}
              {/*<CheckboxItem key={i.value}*/}
                {/*onChange={() => this.onChange(i.value)}*/}
                {/*extra={'$' + i.price}*/}
              {/*>*/}
                {/*{i.label}*/}
              {/*</CheckboxItem>*/}
            {/*))}*/}
            {/*<CheckboxItem*/}
              {/*key="disabled"*/}
              {/*data-seed="logId" disabled defaultChecked multipleLine>*/}
              {/*Undergraduate*/}
              {/*<List.Item.Brief>Auxiliary text</List.Item.Brief>*/}
            {/*</CheckboxItem>*/}
          {/*</List>*/}
        {/*</div>*/}


        {/*<div className="sub-title">to be settled up</div>*/}
        {/*<Result*/}
          {/*img={myImg('HWuSTipkjJRfTWekgTUG')}*/}
          {/*// title="等待处理"*/}
          {/*message="to be settled up"*/}
        {/*/>*/}

        {/*<WhiteSpace size="lg" />*/}

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


        <ReceiptButton updateReceipt={this.updateReceipt}/>
        {/* <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title="This is title"
              thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
              extra={<span>this is extra</span>}
            />
            <Card.Body>
              <div>This is content of `Card`</div>
            </Card.Body>
            <Card.Footer content="footer content" extra={<div>extra footer content</div>} />
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank> */}
      </div>
    );
  }
}

const CreateForm = createForm()(H5NumberInputExample);

export { CreateForm }
