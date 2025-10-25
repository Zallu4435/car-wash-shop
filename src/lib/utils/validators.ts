export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const isValidPincode = (pincode: string): boolean => {
  return /^\d{6}$/.test(pincode);
};

export const isValidPlateNumber = (plate: string): boolean => {
  // Format: MH12AB1234
  return /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(plate);
};

export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);
};

export const validateCouponCode = (code: string): boolean => {
  return /^[A-Z0-9]{4,}$/.test(code);
};
