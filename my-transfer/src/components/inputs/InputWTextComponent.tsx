import classNames from 'classnames';
import "../component.css";

interface InputWTextProps {
    type: string;
    label: string;
    name: string;
    value?: string;
    error?: string;
    touched?: boolean;
    onChange?: (e: React.ChangeEvent<never>) => void;
}

const InputWTextComponent: React.FC<InputWTextProps>  = ({type, label, value, name, error, touched, onChange}) =>{

    const isError = touched && error;

    return(
        <div className="d-flex flex-column">
            <label htmlFor={name}>{label}</label>
            <input id = {name}
                   type={type}
                   className={classNames("form-control", {
                        "is-invalid": isError
                    })}
                    onChange={onChange}
                   value={value}
                   accept={type === "file" ? "image/jpeg,image/png,image/webp" : undefined}
            />

            {isError && (<div className="invalid-feedback">{error}</div>)}
        </div>
    );
}

export default InputWTextComponent;