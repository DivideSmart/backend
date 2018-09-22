import 'regenerator-runtime/runtime'

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import {
  Link,
} from 'react-router-dom'
import React from 'react'
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import classNames from 'classnames';
import green from '@material-ui/core/colors/green';
import { withStyles } from '@material-ui/core/styles';
import '../../style/index.less'

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    // width: 500,
    position: 'relative',
    minHeight: 200,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
  },
});


class FlaoatingButton extends React.Component {
  constructor() {
    super()
    this.state = {
      value: 0,
    };

    this.handleChange = (event, value) => {
      this.setState({ value });
    };

    this.handleChangeIndex = index => {
      this.setState({ value: index });
    };

  }

  render() {
    const { classes, theme } = this.props;
    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };

    const fabs = [
      {
        color: 'primary',
        className: classes.fab,
        icon: <AddIcon />,
      },
      {
        color: 'secondary',
        className: classes.fab,
        icon: <EditIcon />,
      },
      {
        color: 'inherit',
        className: classNames(classes.fab, classes.fabGreen),
        icon: <UpIcon />,
      },
    ];

    return (
      // <Zoom
      //   key={fab.color}
      //   in={this.state.value === index}
      //   timeout={transitionDuration}
      //   style={{
      //     transitionDelay: `${this.state.value === index ? transitionDuration.exit : 0}ms`,
      //   }}
      //   unmountOnExit
      // >
        <Link to={'/create'}>
          <Button
            variant="fab"
            className={classes.fab + ' create-debt-btn'}
            style={{bottom: 66, zIndex: 1000, position: 'fixed'}}
          >
            <AddIcon style={{ color: 'white' }} />
          </Button>
        </Link>
      // </Zoom>
    );
  }
}

// FlaoatingButton.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired,
// };

export default withStyles(styles, { withTheme: true })(FlaoatingButton);

