import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import FormFeild from '../../ui/formFeilds';
import { validate } from '../../ui/misc';
import { firebaseDB } from '../../../firebase';
import DashboardLayout from '../../../Hoc/DashboardLayout';

export default class AddLeague extends Component {

    state = {
        formType:'Add New League',
        formError: false,
        formSucces: '',
        team:[],
        formData:{
            leagueName:{
                element:'input',
                value:'',
                config:{
                    label: 'League Name',
                    name: 'league_name',
                    type: 'text',
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: true
            }
        }
    }

    updateForm(element){
        const newFormData = {...this.state.formData};
        const newElement = {...newFormData[element.id]};
        //console.log(this.state.formData);
        if(newElement.element==='checkbox'){
            //console.log(newElement.checked);
            newElement.checked = element.event.target.checked;
            newElement.value = newElement.checked ? true : false;
            //console.log(newElement.checked);
        } else {
            newElement.value = element.event.target.value;
        }

        let valiData = validate(newElement);
        newElement.valid = valiData[0];
        newElement.validationMessage = valiData[1];

        newFormData[element.id] = newElement;
        this.setState({
            formError: false,
            formData: newFormData
        });
        //console.log(this.state.formData);
    }

    successForm(message){
        this.setState({formSuccess:message});
        setTimeout(()=>{
            this.setState({formSuccess:''});
        },2000);
    }

    submitForm(event){
        event.preventDefault();
        let dataToSubmit = {};
        let formIsValid = true;

        for(let key in this.state.formData){
            dataToSubmit[key] = this.state.formData[key].value;
            formIsValid = this.state.formData[key].valid && formIsValid;
            //console.log(key,formIsValid);
        }


        if(formIsValid){
            const uid = this.props.user.uid;
            const league = this.state.formData.leagueName.value;

            firebaseDB.ref(`allLeagueUrlName`).once('value').then((snapshot)=>{
                if(snapshot.hasChild(league)){
                    // league with the given name already exist
                    this.setState({formError:true});
                } else {
                    firebaseDB.ref(`users/${uid}/${league}`).set(dataToSubmit).then(() => {
                        firebaseDB.ref(`allLeagueUrlName/${league}`).set(true).then(() => {
                            this.props.history.push(`/${league}/admin_matches`);
                        }).catch((e) => {
                            this.setState({formError:true});
                        })
                    }).catch((e) => {
                        this.setState({formError:true});
                    })
                }
            });
            
        } else {
            this.setState({
                formError: true
            });
        }
    }

    render() {
        return (
            <DashboardLayout {...this.props}>
                <div className="addleague_dialog_wrapper">
                    <h2>{this.state.formType}</h2>
                    <div>
                        <form onSubmit={(event) => this.submitForm(event)}>
                            <FormFeild
                                id={'leagueName'}
                                formData={this.state.formData.leagueName}
                                change={(element)=> this.updateForm(element)}
                            />

                            <div className="success_label">{this.state.formSuccess}</div>
                            {this.state.formError && 
                                <div className="error_label">Something is wrong</div>}
                            <div className="admin_submit">
                                <button onClick={(event) => this.submitForm(event)}>
                                    {this.state.formType}
                                </button>
                                <Link to="/dashboard">
                                    <button>Back</button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </DashboardLayout>
        )
    }
}
