import React from 'react'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className="container">
            <div className="error_wrapper">
                <h1>Error 404</h1>
                <p>Opps! Page not Found :(</p>
                <p>You have no acces to the page or it does not exist.</p>
                <Link to='/'>
                    <Button color='primary' variant="contained">Back to Home</Button>
                </Link>
            </div>
        </div>
    )
}

export default ErrorPage;
