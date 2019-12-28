import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

const FormFeild = ({formData,id,change}) => {

    const showError = () => {
        return (
            <div className="error_label">
                {
                    (formData.validation && !formData.valid) && 
                    formData.validationMessage
                }
            </div>
        );
    }

    const renderTemplate = () => {
        let formTemplate = null;
        switch(formData.element){
            case ('input'):
                formTemplate = (
                    <div>
                        {formData.showLabel && 
                            <div className="label_inputs">{formData.config.label}</div>}
                        <input
                            {...formData.config}
                            value={formData.value}
                            onChange={(event) => {change({event,id})}}
                        />
                        { showError() }
                    </div>
                );
                break;
            case ('select'):
                formTemplate = (
                    <div>
                        {formData.showLabel && 
                            <div className="label_inputs">{formData.config.label}</div>}
                        <select
                            value={formData.value}
                            onChange={(event) => {change({event,id})}}
                        >
                            <option value="">Select one</option>
                            {
                                formData.config.options.map((item) => (
                                    <option value={item.key} key={item.key}>
                                        {item.value}
                                    </option>
                                ))
                            }
                        </select>
                        { showError() }
                    </div>
                );
                break;
            case ('checkbox'):
                formTemplate = (
                    <div>
                        {formData.showLabel && 
                            <div className="label_inputs">{formData.config.label}</div>}
                        <Checkbox
                        checked={formData.checked}
                        onChange={(event) => {change({event,id})}}
                        value={String(formData.value)}
                        color="primary"
                        />
                    </div>
                );
                break;
            default:
                formTemplate = null;
        }
        return formTemplate;
    }

    return (
        <div>
            {renderTemplate()}
        </div>
    )
};

export default FormFeild;