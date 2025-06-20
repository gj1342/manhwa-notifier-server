// Placeholder for validation schemas (e.g., using Joi)
export const validate = () => true;

export const isStrongPassword = (password) => {
  if (typeof password !== 'string') return false;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}; 