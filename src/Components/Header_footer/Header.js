import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { firebase } from '../../firebase';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

class Header extends Component {
    signout(){
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            this.props.history.push('/sign_up');
          }).catch((e) => {
            // An error happened.
            console.log("sign out error!");
          });
    }

    render(){
        return(
            <AppBar
                position="fixed"
                style={{
                    backgroundColor: '#3a468b',
                    boxShadow: 'none',
                    padding: '16px 0',
                    borderBottom: '1px solid #3a468b'
                }}
            >
                <Toolbar style={{display: 'flex'}}>
                    <div style={{flexGrow: 1}}>
                            <div className='header_text'>
                                <Link to="/">
                                    LEAGUI
                                </Link>
                            </div>
                    </div>
                    <Link to='/about'>
                        <Button color='inherit'>About</Button>
                    </Link>
                </Toolbar>

            </AppBar>
        );
    };
}

export default Header;