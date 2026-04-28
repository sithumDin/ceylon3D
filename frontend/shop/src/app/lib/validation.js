/**
 * Form validation utilities for the application
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (Sri Lankan format)
export const validatePhoneNumber = (phone) => {
  // Accept formats like: +94 77 123 4567, 0777123456, +94777123456, 077 123 4567
  const phoneRegex = /^(\+94|0)?[1-9]\d{8,9}$/;
  const cleanPhone = phone.replace(/\s+/g, ''); // Remove spaces
  return phoneRegex.test(cleanPhone);
};

// Password validation
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return {
    isValid: password.length >= minLength && hasUppercase && hasLowercase && hasSymbol && hasNumber,
    minLength: password.length >= minLength,
    hasUppercase,
    hasLowercase,
    hasSymbol,
    hasNumber,
    length: password.length
  };
};

// Name validation
export const validateName = (name) => {
  const trimmed = name.trim();
  return {
    isValid: trimmed.length >= 2 && trimmed.length <= 100,
    isEmpty: trimmed.length === 0,
    isTooShort: trimmed.length < 2,
    isTooLong: trimmed.length > 100
  };
};

// Message/Text validation
export const validateMessage = (message) => {
  const trimmed = message.trim();
  return {
    isValid: trimmed.length >= 10 && trimmed.length <= 2000,
    isEmpty: trimmed.length === 0,
    isTooShort: trimmed.length < 10,
    isTooLong: trimmed.length > 2000
  };
};

// File validation for STL/3D model files
export const validateFile = (file, allowedTypes = ['.stl', '.obj', '.pdf', '.jpg', '.jpeg', '.png']) => {
  if (!file) {
    return {
      isValid: false,
      error: 'Please select a file'
    };
  }

  const maxSizeMB = 50;
  const maxSize = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    };
  }

  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  return {
    isValid: true,
    error: null
  };
};

// Contact form validation
export const validateContactForm = (formData) => {
  const errors = {};

  // Name validation
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = 'Name must be between 2 and 100 characters';
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation (optional but if provided, must be valid)
  if (formData.phone && formData.phone.trim()) {
    if (!validatePhoneNumber(formData.phone)) {
      errors.phone = 'Please enter a valid phone number (e.g., +94 77 123 4567)';
    }
  }

  // Message validation
  const messageValidation = validateMessage(formData.message);
  if (!messageValidation.isValid) {
    if (messageValidation.isEmpty) {
      errors.message = 'Message is required';
    } else if (messageValidation.isTooShort) {
      errors.message = 'Message must be at least 10 characters long';
    } else if (messageValidation.isTooLong) {
      errors.message = 'Message must be less than 2000 characters';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Login form validation
export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Registration form validation
export const validateRegistrationForm = (fullName, email, password) => {
  const errors = {};

  // Name validation
  const nameValidation = validateName(fullName);
  if (!nameValidation.isValid) {
    errors.fullName = 'Full name must be between 2 and 100 characters';
  }

  // Email validation
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = [];
    if (!passwordValidation.minLength) {
      errors.password.push('At least 8 characters');
    }
    if (!passwordValidation.hasUppercase) {
      errors.password.push('One uppercase letter');
    }
    if (!passwordValidation.hasLowercase) {
      errors.password.push('One lowercase letter');
    }
    if (!passwordValidation.hasNumber) {
      errors.password.push('One number');
    }
    if (!passwordValidation.hasSymbol) {
      errors.password.push('One special character (!@#$%^&* etc.)');
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    passwordCheck: passwordValidation
  };
};

// Generic form field validation
export const validateFormField = (fieldName, value, rules = {}) => {
  const errors = [];

  switch (fieldName.toLowerCase()) {
    case 'email':
      if (!value.trim()) {
        errors.push('Email is required');
      } else if (!validateEmail(value)) {
        errors.push('Please enter a valid email address');
      }
      break;

    case 'phone':
    case 'phonenumber':
      if (value.trim() && !validatePhoneNumber(value)) {
        errors.push('Please enter a valid phone number');
      }
      break;

    case 'password':
      const passwordValidation = validatePassword(value);
      if (!passwordValidation.isValid) {
        if (!passwordValidation.minLength) errors.push('Password must be at least 8 characters');
        if (!passwordValidation.hasUppercase) errors.push('Must contain uppercase letter');
        if (!passwordValidation.hasLowercase) errors.push('Must contain lowercase letter');
        if (!passwordValidation.hasNumber) errors.push('Must contain number');
        if (!passwordValidation.hasSymbol) errors.push('Must contain special character');
      }
      break;

    case 'name':
    case 'fullname':
      const nameValidation = validateName(value);
      if (!nameValidation.isValid) {
        errors.push('Name must be between 2 and 100 characters');
      }
      break;

    case 'message':
    case 'description':
      const messageValidation = validateMessage(value);
      if (!messageValidation.isValid) {
        if (messageValidation.isEmpty) errors.push('This field is required');
        else if (messageValidation.isTooShort) errors.push('Must be at least 10 characters');
        else if (messageValidation.isTooLong) errors.push('Must be less than 2000 characters');
      }
      break;

    default:
      if (rules.required && !value.trim()) {
        errors.push(`${fieldName} is required`);
      }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
