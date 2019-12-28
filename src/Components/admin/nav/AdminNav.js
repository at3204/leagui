import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import { firebase } from '../../../firebase';

const AdminNav = (props) => {
    const league = props.children._self.props.match.params.league;
    const links = [{
            title: 'Add Teams',
            linkTo: `/${league}/admin_players/edit_team`
        },{
            title: 'Matches',
            linkTo: `/${league}/admin_matches`
        },{
            title: 'Add Match',
            linkTo: `/${league}/admin_matches/edit_match`
        },{
            title: 'Players',
            linkTo: `/${league}/admin_players`
        },{
            title: 'Add Players',
            linkTo: `/${league}/admin_players/add_player`
        },{
            title: 'Leagues Dahboard',
            linkTo: '/dashboard'
    }]

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

    const renderItems = () => (
        links.map((link) => (
            <Link to={link.linkTo} key={link.title}>
                <ListItem button style={style}>
                    {link.title}
                </ListItem>
            </Link>
        ))
    );

    const logout = () => {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            this.props.history.push('/sign_up');
          }).catch((e) => {
            // An error happened.
            console.log("sign out error!");
          });
    }

    return (
        <div>
            <ListItem style={leagueTitleStyle}>
                    {league}
            </ListItem>
            {renderItems()}
            <ListItem button style={style} onClick={logout}>
                log out
            </ListItem>
        </div>
    );
};

export default AdminNav;