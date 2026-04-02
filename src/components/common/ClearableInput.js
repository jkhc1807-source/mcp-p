import React from 'react';
import './ClearableInput.css';

const ClearableInput = ({ label, value, onChange, placeholder, type = 'text', name, rows = 3 }) => {
  const isTextarea = type === 'textarea';

  return (
    <div className={`clearable-input-wrapper ${isTextarea ? 'is-textarea' : ''}`}>
      {label && <label>{label}</label>}
      <div className="input-container">
        {isTextarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="off"
          />
        )}
        {value && (
          <button
            type="button"
            className="btn-clear"
            onClick={() => onChange({ target: { name, value: '' } })}
            aria-label="Clear input"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default ClearableInput;
