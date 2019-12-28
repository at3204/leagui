import React, { Component } from 'react'
import AdminLayout from '../../../Hoc/AdminLayout';
import FormFeild from '../../ui/formFeilds';
import { validate } from '../../ui/misc';
import Fileuploader from '../../ui/fileuploader';
import { firebaseDB, firebase } from '../../../firebase';

export default class AddEditTeams extends Component {

    state = {
        teamId: '',
        formType: '',
        formError: false,
        fromSuccess: '',
        defaultImg: '',
        formData: {
            name:{
                element:'input',
                value:'',
                config:{
                    label: 'Team Name',
                    name: 'name_input',
                    type: 'text',
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: true
            },
            shortName:{
                element:'input',
                value:'',
                config:{
                    label: 'Team Short Name',
                    name: 'short_name_input',
                    type: 'text',
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: true
            },
            thmb:{
                element:'image',
                value:'',
                validation:{
                    required: true,
                },
                valid:true
            }
        }
    }

    updateFields = (team, teamId, formType, defaultImg) => {
        const newFormData = {...this.state.formData};

        for(let key in newFormData){
            newFormData[key].value = team[key];
            newFormData[key].valid = true;
        }

        this.setState({
            teamId,
            defaultImg,
            formType,
            formData: newFormData
        })
        //console.log(this.state.defaultImg);
    }

    componentDidMount() {
        const teamId = this.props.match.params.id;
        //const uid = this.props.user.uid;
        const league = this.props.match.params.league;
        
        if(!teamId){
            this.setState({
                formType: 'Add Team'
            })
        } else {
            firebaseDB.ref(`leagues/${league}/teams/${teamId}`).once('value')
            .then(snapshot => {
                const teamData = snapshot.val();
                //console.log(teamId);
                if(teamData.thmb){
                    firebase.storage().ref('teams')
                    .child(teamData.thmb).getDownloadURL()
                    .then( url => {
                        this.updateFields(teamData, teamId, 'Edit Team', url);
                    })
                } else {
                    this.updateFields(teamData, teamId, 'Edit Team', '');
                }

            })
        }
    }

    updateForm(element, content = ''){
        const newFormData = {...this.state.formData};
        const newElement = {...newFormData[element.id]};

        if(content === ''){
            newElement.value = element.event.target.value;
        } else {
            newElement.value = content;
        }

        let valiData = validate(newElement);
        newElement.valid = valiData[0];
        newElement.validationMessage = valiData[1];

        newFormData[element.id] = newElement;
        this.setState({
            formError: false,
            formData: newFormData
        });
    }

    successForm = (message) => {
        this.setState({
            formSuccess: message
        });
        setTimeout(() => {
            this.setState({
                formSuccess: ''
            });
        }, 2000);
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
            //const uid = this.props.user.uid;
            const league = this.props.match.params.league;
            if(this.state.formType === 'Edit Team'){
                firebaseDB.ref(`leagues/${league}/teams/${this.state.teamId}`)
                .update(dataToSubmit).then(() => {
                    this.successForm('update correctly');
                }).catch(e => {
                    this.setState({formError: true});
                });
            } else {
                firebaseDB.ref(`leagues/${league}/teams/`).push(dataToSubmit).then(() => {
                    this.props.history.push(`/${league}/admin_players`);
                }).catch(e => {
                    this.setState({formError: true});
                })
            }
        } else {
            this.setState({
                formError: true
            });
        }
    }

    resetImage = () => {
        const newFormData = {...this.state.formData};
        newFormData['thmb'].value = '';
        this.setState({
            defaultImg: '',
            formData: newFormData
        });
    }

    storeFilename = (filename) => {
        this.updateForm({id:'thmb'},filename)
    }

    render() {
        //console.log(this.state.defaultImg);
        return (
            <AdminLayout>
                <div className="editplayers_dialog_wrapper">
                    <h2>
                        {this.state.formType}
                    </h2>
                    <div>
                        <form onSubmit={(event) => this.submitForm(event)}>
                            <Fileuploader
                                dir = "teams"
                                tag = {"Team Icon"}
                                defaultImg = {this.state.defaultImg}
                                defaultImgName = {this.state.formData.thmb.value}
                                resetImage = {() => this.resetImage()}
                                filename = {(filename) => this.storeFilename(filename)}
                            />

                            <FormFeild
                                id = {'name'}
                                formData = {this.state.formData.name}
                                change = {(element) => this.updateForm(element)}
                            />

                            <FormFeild
                                id = {'shortName'}
                                formData = {this.state.formData.shortName}
                                change = {(element) => this.updateForm(element)}
                            />

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
