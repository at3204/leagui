import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    lock_avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
    },
    profile_avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main
    }
  }));
  
const LockIcon = () => {

    const classes = useStyles();
    return (
        <div className={classes.paper}>
          <Avatar className={classes.lock_avatar}>
            <LockOutlinedIcon />
          </Avatar>
        </div>
    )
}

const ProfileIcon = () => {

  const classes = useStyles();
  return (
      <div className={classes.paper}>
        <Avatar className={classes.profile_avatar}>
          <AccountBoxIcon />
        </Avatar>
      </div>
  )
}

export { LockIcon, ProfileIcon }