import React from 'react'

const About = () => {
    return (
        <div className="about_container">
            <div className="about_wrapper">
                <h1>About Leagui</h1>
                <br/>
                <h3>Beta-Disclaimer</h3>
                <p>
                    This is a Beta version site of Leagui. 
                    In the process of being tested before its official release,
                    Leagui does not give any warranties, whether express or implied, 
                    as to the suitability or usability of the website, 
                    its software or any of its content.
                </p>
                <p>
                    Leagui will not be liable for any loss, whether such loss is direct, 
                    indirect, special or consequential, 
                    suffered by any party as a result of their use of the beta website, 
                    its content and functionalities.
                </p>
                <p>If you have any concerns or recommedations, please contact us.</p>
                <br/>
                <h3>Contact Us</h3>
                <p>github: <span/>
                    <a href="https://github.com/at3204/leagui">
                         github.com/at3204/leagui
                    </a>
                </p>
                <p>email: <span/>
                    <a href="mailto: leagui124@gmail.com">
                         leagui124@gmail.com
                    </a>
                </p>
                <br/>
                <p>Leagui Team</p>
            </div>
        </div>
    )
}

export default About;