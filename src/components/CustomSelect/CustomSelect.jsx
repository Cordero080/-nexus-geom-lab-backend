import React, { useState, useRef, useEffect } from 'react';
import {
  createClickOutsideHandler,
  createSelectHandler,
  createToggleHandler,
} from '../../utils/handlers/customSelectHandlers';
import styles from './CustomSelect.module.scss';

const CustomSelect = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown when clicking outside - handler from utils
  useEffect(() => {
    const handleClickOutside = createClickOutsideHandler(selectRef, setIsOpen);
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler for selecting option - from utils
  const handleSelect = createSelectHandler(onChange, setIsOpen);

  // Handler for toggling dropdown - from utils
  const handleToggle = createToggleHandler(isOpen, setIsOpen);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={styles.customSelect} ref={selectRef}>
      <div 
        className={`${styles.customSelect__trigger} ${isOpen ? styles.open : ''}`}
        onClick={handleToggle}
      >
        <span className={styles.customSelect__value}>{selectedOption?.label}</span>
        <span className={styles.customSelect__arrow}>{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div className={styles.customSelect__dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.customSelect__option} ${option.value === value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
