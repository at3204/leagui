import React, { Component } from 'react';
import { easePolyOut } from 'd3-ease';
import Animate from 'react-move/Animate';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import video from '../../../Resources/video/video.mp4';

export default class Text extends Component {

    animateFirst = () => (
        <Animate
            show={true}
            start={{
                opacity:0,
                left:300,
            }}
            enter={{
                opacity:[1],
                left:[274],
                timing:{duration:1000, ease:easePolyOut}
            }}
        >
            {({opacity,left}) => (
                <div className="home_first"
                    style={{
                        opacity,
                        transform: `translate(${left}px, 450px)`
                    }}
                >
                    LEAGUI
                </div>
            )}
        </Animate>
    )

    animateSecond = () => (
        <Animate
            show={true}
            start={{
                opacity:0,
                left:260
            }}
            enter={{
                opacity:[1],
                left:[273],
                timing:{delay:500, duration:1000, ease:easePolyOut}
            }}
        >
            {({opacity,left}) => (
                <div className="home_second"
                    style={{
                        opacity,
                        transform: `translate(${left}px, 600px)`
                    }}
                >
                    Sports management web app for Leagues and Teams
                </div>
            )}
        </Animate>
    )

    animateThird = () => (
        <Animate
            show={true}
            start={{
                opacity:0,
                left:260
            }}
            enter={{
                opacity:[1],
                left:[273],
                timing:{delay:500, duration:1000, ease:easePolyOut}
            }}
        >
            {({opacity,left}) => (
                <div className="home_second"
                    style={{
                        opacity,
                        transform: `translate(${left}px, 600px)`
                    }}
                >
                    Create your own Leagues, store the Players and Matches info
                </div>
            )}
        </Animate>
    )

    render() {
        return (
            <div>
                <video className="home_video" autoPlay loop muted>
                    <source src={video} type="video/mp4" />
                </video>
            
                <div className="home_text">
                    {this.animateFirst()}
                    {this.animateSecond()}
                    {this.animateThird()}
                    <div className="home_button_wrapper">
                        <div className="home_botton">
                            <Link to="/sign_in">
                                <Button size="large" variant="contained" color="primary">sign in</Button>
                            </Link>
                        </div>
                        <div className="home_botton">
                            <Link to="/sign_up">
                                <Button size="large" variant="contained" color="primary">sign up</Button>
                            </Link>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}


