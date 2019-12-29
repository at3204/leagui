import React, { Component } from 'react';
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

export default class AdminMatches extends Component {
    state = {
        isLoading: true,
        league: '',
        matches: []
    }

    componentDidMount(){
        const league = this.props.match.params.league;
        firebaseDB.ref(`leagues/${league}/matches`).once('value').then((snapshot) => {
            const matches = firebaseLooper(snapshot);
            this.setState({
                isLoading: false,
                league,
                matches: reverseArray(matches)
            });
        });
    }

    render() {
        return (
            <AdminLayout {...this.props}>
                <div className="adimin_table">
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Match</TableCell>
                                    <TableCell>Result</TableCell>
                                    <TableCell>Final</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    !!this.state.matches && this.state.matches.map((match,i) => {
                                    return(
                                        <TableRow key={i}>
                                            <TableCell>{match.date}</TableCell>
                                            <TableCell>
                                                <Link to={`/${this.state.league}/admin_matches/edit_match/${match.id}`}>
                                                    {match.local} <strong>-</strong> {match.away}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{match.resultLocal} <strong>-</strong> {match.resultAway}</TableCell>
                                            <TableCell>
                                                {match.final === "Yes" ?
                                                    <span className="matches_tag_red">Final</span>
                                                    :
                                                    <span className="matches_tag_green">Not played yet</span>
                                                }
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
