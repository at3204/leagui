import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import { firebase } from '../../../firebase';

const DashBoardNav = (props) => {

    const style = {
        color: '#ffffff',
        fontWeight: '300',
        borderBottom: '1px solid #353535'
    }

    const leagueTitleStyle = {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: '25px',
        borderBottom: '1px solid #353535',
        backgroundColor: '#143872'
    }

    const logout = () => {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            props.children._self.props.history.push('/sign_in');
          }).catch((e) => {
            // An error happened.
            console.log("sign out error!");
          }
        );
    }

    return (
        <div>
            <ListItem style={leagueTitleStyle}>
                    Dashboard
            </ListItem>
            <Link to='/dashboard/add'>
                <ListItem button style={style}>
                    Add new league
                </ListItem>
            </Link>
            <ListItem button style={style} onClick={logout}>
                Logout
            </ListItem>
        </div>
    );
};

export default DashBoardNav;