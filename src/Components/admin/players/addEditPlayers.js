import React, { Component } from 'react'
import AdminLayout from '../../../Hoc/AdminLayout';
import FormFeild from '../../ui/formFeilds';
import { validate, firebaseLooper } from '../../ui/misc';
import Fileuploader from '../../ui/fileuploader';
import { firebaseDB, firebase } from '../../../firebase';

export default class AddEditPlayer extends Component {

    state = {
        playerId: '',
        formType: '',
        formError: false,
        fromSuccess: '',
        defaultImg: '',
        teams: [],
        formData: {
            name:{
                element:'input',
                value:'',
                config:{
                    label: 'Player Name',
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
            lastname:{
                element:'input',
                value:'',
                config:{
                    label: 'Player Last Name',
                    name: 'last_name_input',
                    type: 'text',
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: true
            },
            team:{
                element:'select',
                value:'',
                config:{
                    label: 'Team',
                    name: 'select_team',
                    type: 'select',
                    options: []
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: true
            },
            number:{
                element:'input',
                value:'',
                config:{
                    label: 'Number',
                    name: 'number_input',
                    type: 'text',
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: true
            },
            position:{
                element:'input',
                value:'',
                config:{
                    label: 'Position',
                    name: 'position',
                    type: 'text',
                },
                validation:{
                    required: true,
                },
                valid:false,
                validationMessage:'',
                showLabel: true
            },
            image:{
                element:'image',
                value:'',
                validation:{
                    required: true,
                },
                valid:true
            }
        }
    }

    updateFields = (player, playerId, formType, defaultImg) => {
        const newFormData = {...this.state.formData};

        for(let key in newFormData){
            newFormData[key].value = player[key];
            newFormData[key].valid = true;
        }

        this.setState({
            playerId,
            defaultImg,
            formType,
            formData: newFormData
        })
        //console.log(this.state.defaultImg);
    }

    updateTeams(teamOptions, teams){
        const newFormData = {
            ...this.state.formData
        }
        for(let key in newFormData){
            if(key === 'team'){
                newFormData[key].config.options = teamOptions;
            }
        }
        this.setState({
            FormData: newFormData,
            teams
        });
    }

    componentDidMount() {
        const playerId = this.props.match.params.id;
        //const uid = this.props.user.uid;
        const league = this.props.match.params.league;
        firebaseDB.ref(`leagues/${league}/teams`).once('value').then((snapshot)=>{
            const teams = firebaseLooper(snapshot);
            const teamOptions = [];
            snapshot.forEach((childSnapshot) => {
                teamOptions.push({
                    key: childSnapshot.key,
                    value: childSnapshot.val().shortName
                })
            });
            this.updateTeams(teamOptions,teams);
        });
        if(!playerId){
            this.setState({
                formType: 'Add Player'
            })
        } else {
            firebaseDB.ref(`leagues/${league}/players/${playerId}`).once('value')
            .then(snapshot => {
                const playerData = snapshot.val();

                if(playerData.image){
                    firebase.storage().ref('players')
                    .child(playerData.image).getDownloadURL()
                    .then( url => {
                        this.updateFields(playerData, playerId, 'Edit Player', url);
                    })
                } else {
                    this.updateFields(playerData, playerId, 'Edit Player', '');
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

        //console.log(dataToSubmit.team);

        if(formIsValid){
            //const uid = this.props.user.uid;
            const league = this.props.match.params.league;
            if(this.state.formType === 'Edit Player'){
                firebaseDB.ref(`leagues/${league}/players/${this.state.playerId}`)
                .update(dataToSubmit).catch(e => {
                    this.setState({formError: true});
                });

                if(!this.state.formError){
                    firebaseDB.ref(`leagues/${league}/teams/${dataToSubmit.team}/players/${this.state.playerId}`)
                    .set(true).then(() => {
                        this.successForm('update correctly');
                    }).catch(e => {
                        this.setState({formError: true});
                    });;
                }
            } else {
                firebaseDB.ref(`leagues/${league}/players/`).push(dataToSubmit).then((snapshot) => {
                    const key = snapshot.key;
                    firebaseDB.ref(`leagues/${league}/teams/${dataToSubmit.team}/players/${key}`)
                    .set(true).then(() => {
                        this.props.history.push(`/${league}/admin_players`);
                    }).catch(e => {
                        this.setState({formError: true});
                    });
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

    deletePlayer = (event) => {
        event.preventDefault();
        const league = this.props.match.params.league;
        firebaseDB.ref(`leagues/${league}/players/${this.state.playerId}`)
        .remove().catch(e => {
            this.setState({formError: true});
        });
        if(!this.state.formError){
            firebaseDB.ref(`leagues/${league}/teams/${this.state.formData.team.value}/players/${this.state.playerId}`)
            .remove().then(() => {
                this.props.history.push(`/${league}/admin_players`);
            }).catch(e => {
                this.setState({formError: true});
            });
        }
    }

    resetImage = () => {
        const newFormData = {...this.state.formData};
        newFormData['image'].value = '';
        this.setState({
            defaultImg: '',
            formData: newFormData
        });
    }

    storeFilename = (filename) => {
        this.updateForm({id:'image'},filename)
    }

    render() {
        return (
            <AdminLayout {...this.props}>
                <div className="editplayers_dialog_wrapper">
                    <h2>
                        {this.state.formType}
                    </h2>
                    <div>
                        <form onSubmit={(event) => this.submitForm(event)}>
                            <Fileuploader
                                dir = "players"
                                tag = {"Player Image"}
                                defaultImg = {this.state.defaultImg}
                                defaultImgName = {this.state.formData.image.value}
                                resetImage = {() => this.resetImage()}
                                filename = {(filename) => this.storeFilename(filename)}
                            />

                            <FormFeild
                                id = {'name'}
                                formData = {this.state.formData.name}
                                change = {(element) => this.updateForm(element)}
                            />

                            <FormFeild
                                id = {'lastname'}
                                formData = {this.state.formData.lastname}
                                change = {(element) => this.updateForm(element)}
                            />

                            <FormFeild
                                id = {'team'}
                                formData = {this.state.formData.team}
                                change = {(element) => this.updateForm(element)}
                            />

                            <FormFeild
                                id = {'number'}
                                formData = {this.state.formData.number}
                                change = {(element) => this.updateForm(element)}
                            />

                            <FormFeild
                                id = {'position'}
                                formData = {this.state.formData.position}
                                change = {(element) => this.updateForm(element)}
                            />
                            <div className="success_label">{this.state.formSuccess}</div>
                            {this.state.formError && 
                                <div className="error_label">Something is wrong</div>}
                            <div className="admin_submit">
                                <button onClick={(event) => this.submitForm(event)}>
                                    {this.state.formType}
                                </button>
                                {   
                                    this.state.formType === 'Edit Player' &&
                                    <button onClick={(event) => this.deletePlayer(event)}>
                                        Delete Player
                                    </button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </AdminLayout>
        )
    }
}
