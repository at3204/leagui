import React, { Component } from 'react'

import { Link } from 'react-router-dom';
import AdminLayout from '../../../Hoc/AdminLayout';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { firebaseDB } from '../../../firebase';
import { firebaseLooper, reverseArray } from '../../ui/misc';

export default class AdminPlayers extends Component {

    state = {
        isLoading: true,
        league: '',
        players: []
    }

    componentDidMount(){
        const league = this.props.match.params.league;
        firebaseDB.ref(`leagues/${league}/players`).once('value').then((snapshot)=>{
            const players = firebaseLooper(snapshot);
            this.setState({
                isLoading: false,
                league,
                players: reverseArray(players)
            })
        });
    }

    render() {
        return (
            <AdminLayout>
                <div className="adimin_table">
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Number</TableCell>
                                    <TableCell>Position</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!!this.state.players && this.state.players.map((player,i) => {
                                    return(
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Link to={`/${this.state.league}/admin_players/add_player/${player.id}`}>{player.name}</Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link to={`/${this.state.league}/admin_players/add_player/${player.id}`}>{player.lastname}</Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link to={`/${this.state.league}/admin_players/add_player/${player.id}`}>{player.number}</Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link to={`/${this.state.league}/admin_players/add_player/${player.id}`}>{player.position}</Link>
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
            </AdminLayout>
        )
    }
}
