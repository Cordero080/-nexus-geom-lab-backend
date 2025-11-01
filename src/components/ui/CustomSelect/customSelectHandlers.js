/**
 * Custom Select Handlers
 *
 * Event handlers for CustomSelect component functionality.
 * Following instructor requirement: all handlers in utils folder.
 */

/**
 * Creates a click outside handler to close dropdown
 * @param {React.RefObject} selectRef - Ref to select container
 * @param {Function} setIsOpen - State setter for dropdown open state
 * @returns {Function} Event handler function
 */
export const createClickOutsideHandler = (selectRef, setIsOpen) => {
  return (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
};

/**
 * Creates a handler for selecting an option
 * @param {Function} onChange - Callback when value changes
 * @param {Function} setIsOpen - State setter for dropdown open state
 * @returns {Function} Selection handler function
 */
export const createSelectHandler = (onChange, setIsOpen) => {
  return (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };
};

/**
 * Creates a handler for toggling dropdown open/close
 * @param {boolean} isOpen - Current open state
 * @param {Function} setIsOpen - State setter for dropdown open state
 * @returns {Function} Toggle handler function
 */
export const createToggleHandler = (isOpen, setIsOpen) => {
  return () => setIsOpen(!isOpen);
};
