import React from 'react';
import Layout from './Hoc/Layout'
import { Switch } from 'react-router-dom';
import Home from './Components/home';
import SignIn from './Components/signin';
import SignUp from './Components/signup';
import AdminLeague from './Components/admin/leagues';
import PrivateRoutes from './Components/authRoutes/privateRoutes';
import PublicRoutes from './Components/authRoutes/publicRoutes';
import AdminMatches from './Components/admin/matches';
import AdminPlayers from './Components/admin/players';
import AddLeague from './Components/admin/leagues/addLeague';
import AddEditMatch from './Components/admin/matches/addEditMatch';
import AddEditPlayers from './Components/admin/players/addEditPlayers';
import AddEditTeam from './Components/admin/players/addEditTeams';
import ErrorPage from './Components/error';
import About from './Components/about';

const Routes = (props) => {
  return(
    <Layout>
      <Switch>
        <PrivateRoutes {...props} path="/:league/admin_players/add_player" exact component={AddEditPlayers} />
        <PrivateRoutes {...props} path="/:league/admin_players/add_player/:id" exact component={AddEditPlayers} />
        <PrivateRoutes {...props} path="/:league/admin_matches/edit_match" exact component={AddEditMatch} />
        <PrivateRoutes {...props} path="/:league/admin_matches/edit_match/:id" exact component={AddEditMatch} />
        <PrivateRoutes {...props} path="/:league/admin_players/edit_team" exact component={AddEditTeam} />
        <PrivateRoutes {...props} path="/:league/admin_players/edit_team/:id" exact component={AddEditTeam} />
        <PrivateRoutes {...props} path="/:league/admin_matches" exact component={AdminMatches} />
        <PrivateRoutes {...props} path="/:league/admin_players" exact component={AdminPlayers} />
        <PrivateRoutes {...props} path="/dashboard" exact component={AdminLeague} />
        <PrivateRoutes {...props} path="/dashboard/add" exact component={AddLeague} />
        <PublicRoutes {...props} restricted={false} path="/" exact component={Home} />
        <PublicRoutes {...props} restricted={false} path="/about" exact component={About} />
        <PublicRoutes {...props} restricted={true} path="/sign_in" exact component={SignIn} />
        <PublicRoutes {...props} restricted={false} path="/sign_up" exact component={SignUp} />
        <PublicRoutes {...props} restricted={false} path="/error" exact component={ErrorPage} />
        <PublicRoutes {...props} restricted={false} component={ErrorPage} />
      </Switch>
    </Layout>
  )
}

export default Routes;
