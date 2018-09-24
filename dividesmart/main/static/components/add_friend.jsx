import 'regenerator-runtime/runtime'

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios'
import { List, WhiteSpace, Button } from 'antd-mobile'
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import green from '@material-ui/core/colors/green';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const Item = List.Item

import {
  Link,
} from 'react-router-dom';
import ListItem from 'antd-mobile/lib/list/ListItem';
import React from 'react'
import { createForm } from 'rc-form';

const variantIcon = {
  success: CheckCircleIcon,
  // warning: WarningIcon,
  // error: ErrorIcon,
  // info: InfoIcon,
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});


function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <Close className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const myImg = src => < img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" style={{ width: 60, height: 60 }} alt="" />;
var sampleData = [
    {
      pk: '1',
      username: 'Harry',
      avatarUrl: 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg',
      acc: 10.28,
    }, {
      pk: '2',
      username: 'Oscar',
      avatarUrl: 'https://www.osustuff.org/img/avatars/2017-04-22/211652.jpg',
      acc: 8.6,
    },
    {
      pk: '3',
      username: 'Hieu',
      avatarUrl: 'https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg',
      acc: 10.28,
    }, {
      pk: '4',
      username: 'Yuyang',
      avatarUrl: 'https://www.shareicon.net/data/256x256/2016/07/05/791216_people_512x512.png',
      acc: 20.66,
    }, {
      pk: '5',
      username: 'Sipanis',
      avatarUrl: 'https://www.osustuff.org/img/avatars/2017-04-22/211652.jpg',
      acc: 8.6,
    }
]

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class AddFriendForm extends React.Component {

  constructor(props) {
    super()
    this.state = {
      email: '',
      entered: [],
      requestsSent: false,
      open: false
    };
    this.addEmailAddress = this.addEmailAddress.bind(this);
    this.removeEmailAddress = this.removeEmailAddress.bind(this);
    this.addFriends = this.addFriends.bind(this);
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  addFriends(event) {
    this.state.entered.forEach(email => {
      axios.post('http://localhost:8000/api/friends', {

      })  
    })
    this.setState({
      requestsSent: true,
      open: true
    })
  }

  addEmailAddress(event) {
    this.state.entered.push({key: this.state.entered.length + 1, email: this.state.email})
    this.setState({
      email: '',
      entered: this.state.entered
    })
  }

  removeEmailAddress(event, checked) {
    this.setState({
      entered: this.state.entered.filter(email => email.email != event.target.name)
    })
  }

  notify(type){
    return () => {
      switch (type) {
        case 'info':
          toast.info('Info message', {
            autoClose: 3000
          });
          break;
        case 'success':
          toast.success('Success message', {
            position: "top-right",
          });
          break;
        case 'warning':
          toast.warn('Warning message');
          break;
        case 'error':
          toast.error('Error message');
          break;
      } 
    };
  };

  render() {
    const { classes } = this.props;
    // const suffix = userName ? <Icon type="check-circle"/> : null;
    return (
      <div>
        <div>
          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />
          <FormControl>
            <Input
              style={{marginLeft: '20%', width: '100%'}}
              id="adornment-email"
              placeholder="Enter email address"
              type='text'
              value={this.state.email}
              onChange={this.handleChange('email')}
              startAdornment={
                <InputAdornment position="start">
                  <IconButton
                  >
                  <PersonAdd />
                  </IconButton>
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment>
                  <IconButton
                    onClick={this.addEmailAddress}
                  >
                  <Done />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <WhiteSpace />
          <WhiteSpace />
          <List renderHeader={() => this.state.entered.length > 0 ? 'Selected emails' : ''} className="email-list">
            { 
              this.state.entered.map(email => {
                return (
                  <Item
                    key = {email.key}
                    extra={<Checkbox 
                      name={email.email} 
                      onClick={this.removeEmailAddress}
                      icon={<IconButton><Close/></IconButton>} >
                    </Checkbox>}
                  >
                    {email.email}
                  </Item>
                )
              })
            }
            <Button onClick={ () => this.addFriends() }> Add all </Button>
          </List>
          <Snackbar anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
          >
            <MySnackbarContentWrapper
              onClose={this.handleClose}
              variant="success"
              message="Sending Requests!"
            />
          </Snackbar>
        </div>
      </div>
    );
  }
}

const AddFriend = createForm()(AddFriendForm);

export { AddFriend }
