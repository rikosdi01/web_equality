import './CheckboxAttribute.css';

const CheckboxAttribute = ({ id, checked, onChange, label }) => {
    return (
        <div className="checkbox-attribute">
            <input
                type="checkbox"
                id={id}
                checked={checked} // ✅ Make sure this is "checked"
                onChange={onChange} // ✅ Attach the onChange handler here
                style={{ cursor: 'pointer' }}
            />
            <label htmlFor={id} style={{ cursor: 'pointer' }}>
                {label}
            </label>
        </div>
    );
}

export default CheckboxAttribute;