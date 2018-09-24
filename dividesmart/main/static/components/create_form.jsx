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
} from 'antd-mobile'

import ListItem from 'antd-mobile/lib/list/ListItem';
import React from 'react'
import ReceiptButton from './material/receipt_float_btn.jsx'
import { createForm } from 'rc-form';
import '../style/index.less'
const RadioItem = Radio.RadioItem;
const CheckboxItem = Checkbox.CheckboxItem


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


let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

const data2 = [
  { value: 0, label: 'divide equally', extra: 'details' },
  { value: 1, label: 'specify amount', extra: 'details' },
];

const tabs = [
  { title: 'Type ' },
  { title: 'Scan Receipt' },
];

  var friendsYouOwe = [
    {
      key: '1',
      name: 'Harry',
      avatarUrl: 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg',
      acc: 10.28,
    }, {
      key: '2',
      name: 'Charlie',
      avatarUrl: 'https://www.shareicon.net/data/256x256/2016/07/05/791216_people_512x512.png',
      acc: 20.66,
    }, {
      key: '3',
      name: 'Oscar',
      avatarUrl: 'https://www.osustuff.org/img/avatars/2017-04-22/211652.jpg',
      acc: 8.6,
    },
  ]

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
    const { getFieldProps } = this.props.form;
    const { type } = this.state;
    return (
      <div>
        <WhiteSpace size="lg" />


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

        <List>
          <InputItem
            {...getFieldProps('inputtitle2')}
            placeholder="Enter names, emails or phones"
          >
            <div style={{ backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/DfkJHaJGgMghpXdqNaKF.png)', backgroundSize: 'cover', height: '22px', width: '22px' }} />
          </InputItem>
        </List>

        <WhiteSpace size="lg" />

        <WhiteSpace size="lg" />
        <List renderHeader={() => 'Split by'}>
        </List>
        <Paper elevation={0}>
          <MList>
            {emails.map(email => (
              <MListItem button key={email}>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="https://forums.dctp.ws/download/file.php?avatar=10907_1408814803.gif" />
                </ListItemAvatar>
                <ListItemText style={{float: 'right'}}  primary={email} />
                <ListItemSecondaryAction>
                  <Input
                    id="adornment-amount"
                    // value={this.state.amount}
                    // onChange={this.handleChange('amount')}
                    style={{width: '16vw', marginRight: '6vw'}}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  />
                </ListItemSecondaryAction>
              </MListItem>
            ))}
            <MListItem button >
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="add people" />
            </MListItem>
          </MList>
        </Paper>


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

        <WhiteSpace size="lg" />
        <List>
          {data2.map(i => (
            <RadioItem key={i.value} checked={this.state.value2 === i.value} onChange={() => this.onChange2(i.value)}>
              {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
            </RadioItem>
          ))}
        </List>



        <div>
          <List renderHeader={() => 'CheckboxItem demo'}>
            {this.state.data.map(i => (
              <CheckboxItem key={i.value}
                onChange={() => this.onChange(i.value)}
                extra={'$' + i.price}
              >
                {i.label}
              </CheckboxItem>
            ))}
            <CheckboxItem
              key="disabled"
              data-seed="logId" disabled defaultChecked multipleLine>
              Undergraduate
              <List.Item.Brief>Auxiliary text</List.Item.Brief>
            </CheckboxItem>
          </List>
        </div>


        <div className="sub-title">to be settled up</div>
        <Result
          img={myImg('HWuSTipkjJRfTWekgTUG')}
          // title="等待处理"
          message="to be settled up"
        />

        <WhiteSpace />
        <WhiteSpace />
        <WhiteSpace />
        <WingBlank>
          <Button type="primary">SAVE</Button>
        </WingBlank>


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
