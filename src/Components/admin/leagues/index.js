import React, { Component } from 'react'
import DashboardLayout from '../../../Hoc/DashboardLayout';
import { firebaseDB, firebase } from '../../../firebase';
import { firebaseLooper, reverseArray } from '../../ui/misc';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

class AdminLeague extends Component {
    state = {
        isLoading: true,
        leagues: [],
        formError: false
    }

    logout(){
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            this.props.history.push('/sign_up');
          }).catch((e) => {
            // An error happened.
            console.log("sign out error!");
          });
    }

    deleteLeague(event, league){
        let error = false;
        event.preventDefault();
        firebaseDB.ref(`leagues/${league}`)
        .remove().catch(e => {
            error = true;
            console.log("delete error!");
        });
        if(!error){
            firebaseDB.ref(`allLeagueUrlName/${league}`)
            .remove().catch(e => {
                error = true;
                console.log("delete error!");
            });
        }

        if(!error){
            firebaseDB.ref(`users/${this.props.user.uid}/${league}`)
            .remove().then(() => {
                this.props.history.push(`/dashboard`);
            }).catch(e => {
                error = true;
                console.log("delete error!");
            });
        }
    }

    componentDidMount(){
        firebaseDB.ref(`users/${this.props.user.uid}`).once('value').then((snapshot) => {
            const leagues = firebaseLooper(snapshot);
            this.setState({
                isLoading: false,
                leagues: reverseArray(leagues)
            });
        });
    }


    render(){
        return (
            <DashboardLayout {...this.props}>
                <div className="adimin_table">
                <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    !!this.state.leagues && this.state.leagues.map((league,i) => {
                                    return(
                                        <TableRow key={i}>
                                            <TableCell>
                                                {league.id}
                                            </TableCell>
                                            <TableCell>
                                            </TableCell>
                                            <TableCell>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="large" color="primary" href={`${league.id}/admin_players`}>
                                                    edit
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="large" color="primary" 
                                                    onClick={(event) => this.deleteLeague(event, league.id)}>
                                                    delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                    <div className="admin_progress">
                        {this.state.isLoading && 
                        <CircularProgress thickness={7} style={{color:'#98c5e9'}}/>}
                    </div>
                </div>
            </DashboardLayout>
        )
    }
}

export default AdminLeague;
