import {Badge, Button, Icon, List, WhiteSpace, WingBlank, Modal } from 'antd-mobile';

import React from 'react'

const Item = List.Item
const Brief = Item.Brief

const prompt = Modal.prompt
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MButton from '@material-ui/core/Button'

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Collapse from '@material-ui/core/Collapse';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';


import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';


class UserTabWithoutStyle extends React.Component {
  constructor() {
    super()
    this.state = {
      showSettleUpModal: false
    }
  }

  render() {

const { classes } = this.props;

    return (
      <div>
        <WhiteSpace />
        <WhiteSpace />
        <List>
          <List.Item extra={
            <div>
              <MButton
                onClick = {() => this.setState({ showSettleUpModal: true })}
                variant="outlined" color="primary" size="small"
              >
                <Icon type={'check-circle-o'} style={{ height: 18, marginRight: 8}}/>
                <span style={{fontSize: 13, fontWeight: 400, paddingTop: 2, textTransform: 'none'}}>Settle Up</span>
              </MButton>
            </div>

          }>
            <Badge>
              <span
                style={{
                  width: '60px',
                  height: '60px',
                  margin: '6px 0px 0px 0px',
                  background: 'url(https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg) center center /  60px 60px no-repeat',
                  display: 'inline-block' }}
              />
            </Badge>
            <span style={{ marginLeft: 12 }}>Harry</span>
          </List.Item>

          <Item
            // arrow="horizontal"
            // thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            // multipleLine
            extra={<span className={'other-owe-amount'}>$20</span>}
          >
            <Badge text={0} style={{ marginLeft: 12 }}>Summary</Badge>
          </Item>

          <List.Item extra="test@test.com"
            // arrow="horizontal"
          >
            <Badge text={0} style={{ marginLeft: 12 }}>Email address</Badge>
            {/* <Badge text={'new'} style={{ marginLeft: 12 }} /> */}
          </List.Item>

          {/*<List.Item>*/}
            {/*Customize*/}
            {/*<Badge text="券" style={{ marginLeft: 12, padding: '0 3px', backgroundColor: '#f19736', borderRadius: 2 }} />*/}
            {/*<Badge text="NEW" style={{ marginLeft: 12, padding: '0 3px', backgroundColor: '#21b68a', borderRadius: 2 }} />*/}
            {/*<Badge text="自动缴费"*/}
              {/*style={{*/}
                {/*marginLeft: 12,*/}
                {/*padding: '0 3px',*/}
                {/*backgroundColor: '#fff',*/}
                {/*borderRadius: 2,*/}
                {/*color: '#f19736',*/}
                {/*border: '1px solid #f19736',*/}
              {/*}}*/}
            {/*/>*/}
          {/*</List.Item>*/}
        </List>


        {/*<Card className={classes.card}>*/}
          {/*<CardContent>*/}
            {/*<List.Item extra={*/}
              {/*<IconButton*/}
                {/*aria-label="Show more"*/}
              {/*>*/}
                {/*<ExpandMoreIcon />*/}
              {/*</IconButton>*/}
            {/*} arrow="horizontal">*/}
              {/*<Badge text={0} style={{ marginLeft: 12 }}>Phone number</Badge>*/}
              {/*/!* <Badge text={'new'} style={{ marginLeft: 12 }} /> *!/*/}
            {/*</List.Item>*/}
          {/*</CardContent>*/}
        {/*</Card>*/}
        {/*<Collapse in={true} timeout="auto" unmountOnExit>*/}
          {/*<List.Item extra="12345678" arrow="horizontal">*/}
            {/*<Badge text={0} style={{ marginLeft: 12 }}>Phone number</Badge>*/}
            {/*/!* <Badge text={'new'} style={{ marginLeft: 12 }} /> *!/*/}
          {/*</List.Item>*/}

          {/*<List.Item extra="test@test.com" arrow="horizontal">*/}
            {/*<Badge text={0} style={{ marginLeft: 12 }}>Email address</Badge>*/}
            {/*/!* <Badge text={'new'} style={{ marginLeft: 12 }} /> *!/*/}
          {/*</List.Item>*/}
        {/*</Collapse>*/}

        <WhiteSpace />
        <List renderHeader={() => 'Debt List with Tom'} className="my-list">
          {/*<Item extra={'Debt'}>Date</Item>*/}
        </List>
        <List>
          <Item
            arrow="horizontal"
            thumb={
              <FontAwesomeIcon icon='receipt' style={{ color: '#38b8f2', width: 24, height: 24}} />
            }
            multipleLine
            onClick={() => {}}
            extra={<span className={'other-owe-amount'}>$10</span>}
          >
            Lunch @ PGP<Brief>8/29/18</Brief>
          </Item>
          <Item
            arrow="horizontal"
            thumb={
              <FontAwesomeIcon icon='dollar-sign' style={{ color: '#38b8f2', width: 24, height: 24}} />
            }
            multipleLine
            onClick={() => {}}
            extra={<span className={'owe-other-amount'}>-$5</span>}
          >
            Movie Night<Brief>8/30/18</Brief>
          </Item>
          <Item
            arrow="horizontal"
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine
            onClick={() => {}}
            extra={<span className={'other-owe-amount'}>$15</span>}
          >
            Dinner Date <Brief>8/31/18</Brief>
          </Item>

          <Item
            arrow="horizontal"
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine
            onClick={() => {}}
            extra={<span className={'other-owe-amount'}>$10</span>}
          >
            Lunch @ PGP<Brief>8/29/18</Brief>
          </Item>
          <Item
            arrow="horizontal"
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine
            onClick={() => {}}
            extra={<span className={'owe-other-amount'}>-$5</span>}
          >
            Movie Night<Brief>8/30/18</Brief>
          </Item>
          <Item
            arrow="horizontal"
            thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
            multipleLine
            onClick={() => {}}
            extra={<span className={'other-owe-amount'}>$15</span>}
          >
            Dinner Date <Brief>8/31/18</Brief>
          </Item>
        </List>

        <WhiteSpace />
        <WhiteSpace />
        <WhiteSpace />

        {/*<Button*/}
          {/*type="primary" icon="check-circle-o"*/}
          {/*// onClick={*/}
          {/*//   () => prompt('defaultValue', 'defaultValue for prompt',*/}
          {/*//     [*/}
          {/*//       { text: 'Cancel' },*/}
          {/*//       { text: 'Submit', onPress: value => console.log(`输入的内容:${value}`) },*/}
          {/*//     ], 'default', '100')*/}
          {/*// }*/}
          {/*onClick = {() => this.setState({ showSettleUpModal: true })}*/}
        {/*>*/}
          {/*Settle Up*/}
        {/*</Button>*/}

        <div style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <MButton
            onClick = {() => this.setState({ showSettleUpModal: true })}
            variant="contained" color="secondary" size="large" style={{ width: '100%', height: 48 }}>
            <Icon type={'check-circle-o'} style={{marginRight: 18}}/> Settle Up
          </MButton>
        </div>

        <Modal
          visible={this.state.showSettleUpModal}
          transparent
          maskClosable={true}
          onClose={() => this.setState({ showSettleUpModal: false })}
          title="Settle up"
          // footer={[{ text: 'Ok', onPress: () => { console.log('ok'); this.onClose('modal1')(); } }]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div >
            <div style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Avatar
                alt="Remy Sharp"
                src="https://forums.dctp.ws/download/file.php?avatar=10907_1408814803.gif"
                style={{width: 60, height: 60}}
              />
            </div>

            <br />
            You pay Harry
            <br /><br />

            <FormControl style={{ marginBottom: 18 }}>
              <InputLabel htmlFor="adornment-amount">Amount</InputLabel>
              <Input
                id="adornment-amount"
                type='number'
                // value={this.state.amount}
                // onChange={this.handleChange('amount')}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
              />
            </FormControl>

            {/* <br />
            <TextField
              id="outlined-adornment-amount"
              className={classNames(classes.margin, classes.textField)}
              variant="outlined"
              type='number'
              label="Amount"
              // value={this.state.amount}
              // onChange={this.handleChange('amount')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            /> */}
            <br/>
            <br/>
            <MButton variant="contained" color="primary" size="medium" style={{ width: '80%', marginBottom: 16 }}>
              Record Payment
            </MButton>
            <MButton variant="outlined" color="secondary" size="medium" style={{ width: '80%', marginBottom: 16 }}>
              Pay With PayPal
            </MButton>

            <WhiteSpace />
          </div>
        </Modal>

        <WhiteSpace />
        <WhiteSpace />
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flexBasis: 280,
  },
})

const UserTab = withStyles(styles)(UserTabWithoutStyle)
export { UserTab}

