import React, { Component } from 'react'
import AdminLayout from '../../../Hoc/AdminLayout';
import FormFeild from '../../ui/formFeilds';
import { validate } from '../../ui/misc';
import { firebaseDB } from '../../../firebase';
import { firebaseLooper } from '../../ui/misc';

export default class AddEditMatch extends Component {

    state = {
        matchId:'',
        formType:'',
        formError: false,
        formSucces: '',
        team:[],
        formData:{
            date:{
                element:'input',
                value:'',
                config:{
                    label: 'Event date',
                    name: 'date_input',
                    type: 'date',
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: true
            },
            local:{
                element:'select',
                value:'',
                config:{
                    label: 'Select local team',
                    name: 'select_local',
                    type: 'select',
                    options: []
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: false
            },
            resultLocal:{
                element:'input',
                value:'',
                config:{
                    label: 'Result local',
                    name: 'result_local_input',
                    type: 'input',
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: false
            },
            away:{
                element:'select',
                value:'',
                config:{
                    label: 'Select local team',
                    name: 'select_local',
                    type: 'select',
                    options: []
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: false
            },
            resultAway:{
                element:'input',
                value:'',
                config:{
                    label: 'Result local',
                    name: 'result_local_input',
                    type: 'input',
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: false
            },
            referee:{
                element:'input',
                value:'',
                config:{
                    label: 'Referee',
                    name: 'referee_input',
                    type: 'text',
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: true
            },
            stadium:{
                element:'input',
                value:'',
                config:{
                    label: 'Stadium',
                    name: 'stadium_input',
                    type: 'text',
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: true
            },
            result:{
                element:'select',
                value:'',
                config:{
                    label: 'Team result',
                    name: 'select_result',
                    type: 'select',
                    options: [
                        {key:'W',value:'W'},
                        {key:'D',value:'D'},
                        {key:'L',value:'L'},
                        {key:'n/a',value:'N/A'}
                    ]
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: true
            },
            final:{
                element:'select',
                value:'',
                config:{
                    label: 'Give played?',
                    name: 'select_played',
                    type: 'select',
                    options: [
                        {key:'Yes',value:'Yes'},
                        {key:'No',value:'No'},
                    ]
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: true
            },
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
        }

        this.state.teams.forEach((team) => {
            if(team.shortName===dataToSubmit.away){
                dataToSubmit['localThmb'] = team.thmb
            }
            if(team.shortName===dataToSubmit.local){
                dataToSubmit['awayThmb'] = team.thmb
            }
        });

        if(formIsValid){
            //const uid = this.props.user.uid;
            const league = this.props.match.params.league;
            if(this.state.formType === 'Edit Match'){
                firebaseDB.ref(`leagues/${league}/matches/${this.state.matchId}`)
                .update(dataToSubmit).then(() => {
                    this.successForm('Updated correctly!')
                }).catch((e) => {
                    this.setState({formError:true});
                })
            }else{
                firebaseDB.ref(`leagues/${league}/matches`).push(dataToSubmit).then(() => {
                    this.props.history.push(`/${league}/admin_matches`);
                }).catch((e) => {
                    this.setState({formError:true});
                })
            }
        } else {
            this.setState({
                formError: true
            });
        }
    }

    updateFields(match,teamOptions,teams,type,matchId){
        const newFormData = {
            ...this.state.formData
        }
        for(let key in newFormData){
            if(match){
                newFormData[key].value = match[key];
                newFormData[key].valid = true;
            }
            if(key === 'local' || key === 'away'){
                newFormData[key].config.options = teamOptions;
            }
        }
        this.setState({
            matchId,
            formType: type,
            teams,
            FormData: newFormData
        });
    }

    componentDidMount(){
        const matchId = this.props.match.params.id;
        //const uid = this.props.user.uid;
        const league = this.props.match.params.league;
        const getTeams = (match, type) => {
            firebaseDB.ref(`leagues/${league}/teams`).once('value').then((snapshot)=>{
                const teams = firebaseLooper(snapshot);
                const teamOptions = [];
                snapshot.forEach((childSnapshot) => {
                    teamOptions.push({
                        key: childSnapshot.val().shortName,
                        value: childSnapshot.val().shortName
                    })
                });
                this.updateFields(match,teamOptions,teams,type,matchId);
            });
        };
        if(!matchId){
            getTeams(null, 'Add Match');
        } else {
            firebaseDB.ref(`leagues/${league}/matches/${matchId}`).once('value')
            .then((snapshot) => {
                const match = snapshot.val();
                getTeams(match, 'Edit Match');
            });
        }
    }

    render() {
        console.log(this.props);
        return (
            <AdminLayout>
                <div className="editmatch_dialog_wrapper">
                    <h2>{this.state.formType}</h2>
                    <div>
                        <form onSubmit={(event) => this.submitForm(event)}>
                            <FormFeild
                                id={'date'}
                                formData={this.state.formData.date}
                                change={(element)=> this.updateForm(element)}
                            />
                            <div className="select_team_layout">
                                <div className="label_inputs">Local</div>
                                <div className="wrapper">
                                    <div className="left">
                                        <FormFeild
                                            id={'local'}
                                            formData={this.state.formData.local}
                                            change={(element)=> this.updateForm(element)}
                                        />
                                    </div>
                                    <div>
                                        <FormFeild
                                            id={'resultLocal'}
                                            formData={this.state.formData.resultLocal}
                                            change={(element)=> this.updateForm(element)}
                                        />
                                    </div>
                                </div>
                                <div className="wrapper">
                                    <div className="left">
                                        <FormFeild
                                            id={'away'}
                                            formData={this.state.formData.away}
                                            change={(element)=> this.updateForm(element)}
                                        />
                                    </div>
                                    <div>
                                        <FormFeild
                                            id={'resultAway'}
                                            formData={this.state.formData.resultAway}
                                            change={(element)=> this.updateForm(element)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="split_fields">
                                <FormFeild
                                    id={'referee'}
                                    formData={this.state.formData.referee}
                                    change={(element)=> {
                                        this.updateForm(element);
                                    }}
                                />
                                <FormFeild
                                    id={'stadium'}
                                    formData={this.state.formData.stadium}
                                    change={(element)=> this.updateForm(element)}
                                />  
                            </div>
                            <div className="split_fields last">
                                <FormFeild
                                    id={'result'}
                                    formData={this.state.formData.result}
                                    change={(element)=> this.updateForm(element)}
                                />
                                <FormFeild
                                    id={'final'}
                                    formData={this.state.formData.final}
                                    change={(element)=> this.updateForm(element)}
                                />
                            </div>

                            <div className="success_label">{this.state.formSuccess}</div>
                            {this.state.formError && 
                                <div className="error_label">Something is wrong</div>}
                            <div className="admin_submit">
                                <button onClick={(event) => this.submitForm(event)}>
                                    {this.state.formType}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AdminLayout>
        )
    }
}
