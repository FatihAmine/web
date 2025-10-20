import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './CustomDropdown.css';

const CustomDropdown = ({ options, value, onChange, icon: Icon, placeholder = 'Sélectionner' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="custom-dropdown-wrapper" ref={dropdownRef}>
      <div 
        className={`custom-dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {Icon && <Icon size={18} />}
        <span className="custom-dropdown-label">{selectedOption?.label || placeholder}</span>
        <ChevronDown 
          size={16}
          className={`custom-dropdown-arrow ${isOpen ? 'open' : ''}`}
        />
      </div>
      {isOpen && (
        <div className="custom-dropdown-menu">
          {options.map(option => {
            const OptionIcon = option.icon;
            return (
              <div
                key={option.value}
                className={`custom-dropdown-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {OptionIcon && (
                  <div className="option-icon" style={{ color: option.color || '#5eead4' }}>
                    <OptionIcon size={16} />
                  </div>
                )}
                <span className="option-label">{option.label}</span>
                {value === option.value && (
                  <Check size={16} className="option-check" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
