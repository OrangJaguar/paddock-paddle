import React, { useRef, useEffect } from "react";

export default function VerificationCodeInput({ value, onChange, length = 6 }) {
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const val = e.target.value;
    
    // Only allow numbers
    if (val && !/^\d$/.test(val)) {
      return;
    }

    const newCode = value.split('');
    newCode[index] = val;
    const newValue = newCode.join('');
    
    onChange(newValue);

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // If current is empty, go to previous
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current
        const newCode = value.split('');
        newCode[index] = '';
        onChange(newCode.join(''));
      }
    }
    
    // Handle left/right arrows
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pastedData);
    
    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-ranch-red focus:outline-none focus:ring-2 focus:ring-ranch-red focus:ring-opacity-20 transition-all"
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}