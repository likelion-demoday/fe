const Input = ({ type = "text", placeholder, value, onChange, className = "", ...rest }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
            {...rest}
        />
    );
};

export default Input;
