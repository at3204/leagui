import React, { Component } from 'react';
import FormFeild from '../ui/formFeilds';
import { validate } from '../ui/misc';
import { firebase } from '../../firebase';
import { Link } from 'react-router-dom';
import { ProfileIcon } from '../ui/icons';

export default class SignUp extends Component {
    state = {
        formError: false,
        formSeccuss: '',
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
            },
            ver_password:{
                element:'input',
                value:'',
                config:{
                    name: 'ver_password_input',
                    type: 'password',
                    placeholder: 'comfirm your password'
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
        if(dataToSubmit.password!==dataToSubmit.ver_password){
            formIsValid = false;
        }
        if(formIsValid){
            firebase.auth().createUserWithEmailAndPassword(
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

    googleSignin(event){
        event.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(() => {
            this.props.history.push('/dashboard');
          }).catch(() => {
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
                        <ProfileIcon/>
                        <h2>Please Sign Up</h2>

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

                        <FormFeild
                                id={'ver_password'}
                                formData={this.state.formData.ver_password}
                                change={(element)=> this.updateForm(element)}
                        />

                        <button onClick={(event) => this.submitForm(event)}>
                                Sign Up
                        </button>

                        {
                            this.state.formError && 
                            <div className="error_label">
                                Something is wrong! Please try again.
                            </div>
                        }

                        <button className="sign_in_button" onClick={(event) => this.googleSignin(event)}>
                                <img class="sign_in_button_img" alt="Google"
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                                <p class="sign_in_button_text">Sign Up with Google</p>
                        </button>
                    </form>
                    <div class="sign_up_sign_in">
                        <Link to="/sign_in">
                            Already have an account? Login
                        </Link>
                    </div>
                    
                </div>
            </div>
        )
    }
}
