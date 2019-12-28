import React from 'react';
import { Link } from 'react-router-dom';

export const Tag = (props) => {
    const template = <div
        style={{
            background: props.bck,
            fontSize: props.size,
            color: props.color,
            padding: "5px 10px",
            display: "inline-block",
            fontFamily: "Righteous"
        }}
    >{props.children}</div>;

    if(props.link){
        return <Link to={props.linkTo}>{template}</Link>;
    } else {
        return template;
    }
}

export const firebaseLooper = (snapshot) => {
    const data = [];
    snapshot.forEach((childSnapshot) => {
        data.push({
            ...childSnapshot.val(),
            id: childSnapshot.key
        });
    })
    return data;
}

export const reverseArray = (actualArray) => {
    let reversedArray = [];
    for(let i=0; i<actualArray.length; i++){
        reversedArray.unshift(actualArray[i]);
    }
    return reversedArray;
}

export const validate = (element) => {
    let error = [true, ''];
    if(element.validation.email){
        const valid = /\S+@\S+\.\S+/.test(element.value);
        const message = `${valid ? '' : 'this field should be an email!'}`;
        error = valid ? error : [valid,message];
    }
    if(element.validation.required){
        const valid = element.value.trim() !== '';
        const message = `${valid ? '' : 'this field is required!'}`;
        error = valid ? error : [valid,message];
    }
    return error;
}