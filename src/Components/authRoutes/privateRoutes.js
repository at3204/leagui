import React, { Component } from 'react';
import { firebaseDB } from '../../firebase';
import { Route, Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
//mport ErrorPage from '../error';

export default class PrivateRoutes extends Component {
    state = {
        auth: false,
        isLoading: true
    }

    update = (value) => {
        this.setState({
            auth: value,
            isLoading: false
        });
    }

    componentDidMount(){
        const user = this.props.user;
        if(this.props.user){
            const league = this.props.computedMatch.params.league;
            if(!!league){
                firebaseDB.ref(`users/${user.uid}/${league}`).once('value').then((snapshot) => {
                    this.update(!!snapshot.val());
                }).catch(e => {
                    this.update(false);
                });
            } else {
                this.update(true);
            }
        }
    }

    render(){
        const {
            user,
            component: Comp,
            ...rest
        } = this.props;

        console.log(this.state);
        return (
            <div>
                {
                    user ? (
                        this.state.isLoading ? 
                            <CircularProgress/> 
                            :
                            <Route {...rest} component={(props) => {
                                return this.state.auth ? <Comp {...props} user={user}/> : <Redirect to="/error" />
                            }}/>
                    ) : <Redirect to="/sign_in" />
                }
            </div>
        )
    }
}

