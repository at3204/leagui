import React, { Component } from 'react';
import FormFeild from '../ui/formFeilds';
import { validate } from '../ui/misc';
import { firebase } from '../../firebase';
import { Link } from 'react-router-dom';
import { LockIcon } from '../ui/icons';

export default class SignIn extends Component {
    state = {
        formError: false,
        formResetErr: false,
        formSuccess: '',
        formData:{
            email:{
                element:'input',
                value:'',
                config:{
                    name: 'email_input',
                    type: 'email',
                    placeholder: 'enter your email'
                },
                validation:{
                    required: true,
                    email: true
                },
                valid:false,
                validationMessage:''
            },
            password:{
                element:'input',
                value:'',
                config:{
                    name: 'password_input',
                    type: 'password',
                    placeholder: 'enter your password'
                },
                validation:{
                    required: true,
                    email: false
                },
                valid:false,
                validationMessage:''
            }
        }
    }

    submitForm(event){
        event.preventDefault();
        let dataToSubmit = {};
        let formIsValid = true;

        for(let key in this.state.formData){
            dataToSubmit[key] = this.state.formData[key].value;
            formIsValid = this.state.formData[key].valid && formIsValid;
        }
        if(formIsValid){
            firebase.auth().signInWithEmailAndPassword(
                dataToSubmit.email,
                dataToSubmit.password
            ).then(() => {
                this.props.history.push('/dashboard');
            }).catch((e) => {
                this.setState({
                    formError: true
                });
            });
        } else {
            this.setState({
                formError: true
            });
        }
    }

    updateForm(element){
        const newFormData = {...this.state.formData};
        const newElement = {...newFormData[element.id]};

        newElement.value = element.event.target.value;

        let valiData = validate(newElement);
        newElement.valid = valiData[0];
        newElement.validationMessage = valiData[1];

        newFormData[element.id] = newElement;
        this.setState({
            formError: false,
            formData: newFormData
        });
    }

    successForm(message){
        this.setState({
            formSuccess: message
        });
        setTimeout(() => {
            this.setState({
                formSuccess: ''
            });
        }, 2000);
    }

    resetPswd(event){
        event.preventDefault();
        let formIsValid = true;

        const emailAddress = this.state.formData.email.value

        if(formIsValid){
            firebase.auth().sendPasswordResetEmail(emailAddress)
            .then(() => {
                this.setState({
                    formResetErr: false
                })
                this.successForm('Password Reset email sent!');
              }).catch((e) => {
                this.setState({
                    formResetErr: true
                })
              });
            
        } else {
            this.setState({
                formResetErr: true
            });
        }
    }

    googleSignin(event){
        event.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(() => {
            this.props.history.push('/dashboard');
          }).catch((e) => {
            this.setState({
                formError: true
            });
          });

    }

    render() {
        return (
            <div className = "container">
                <div className="signin_wrapper" style={{margin:'100px'}}>
                    <form onSubmit={(event) => this.submitForm(event)}>
                        <LockIcon/>
                    
                        <h2>Please Login</h2>

                        <FormFeild
                                id={'email'}
                                formData={this.state.formData.email}
                                change={(element)=> this.updateForm(element)}
                        />

                        <FormFeild
                                id={'password'}
                                formData={this.state.formData.password}
                                change={(element)=> this.updateForm(element)}
                        />

                        <button onClick={(event) => this.submitForm(event)}>
                                Login
                        </button>

                        <button onClick={(event) => this.resetPswd(event)}>
                                Reset Password with Email
                        </button>
                        {
                            this.state.formResetErr && 
                            <div className="error_label">
                                Reset request error: Please provide correct email in the text box.
                            </div>
                        }

                        <div className="success_label">
                            {this.state.formSuccess}
                        </div>

                        {
                            this.state.formError && 
                            <div className="error_label">
                                Something is wrong! Please try again.
                            </div>
                        }
                        
                        <button className="sign_in_button" onClick={(event) => this.googleSignin(event)}>
                                <img alt="Google" class="sign_in_button_img" 
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                                <p class="sign_in_button_text">Sign In with Google</p>
                        </button>
                    </form>
                    
                    <div className="sign_in_sign_up">
                        <Link to="/sign_up">
                            Don't have an account? Sign Up
                        </Link>
                    </div>
                    
                </div>
            </div>
        )
    }
}
