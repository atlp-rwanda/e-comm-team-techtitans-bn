export const successRegistration = {
  fullname: 'Registration',
  email: 'success@gmail.com',
  password: 'Password@123',
  confirmPassword: 'Password@123',
};

// Signup validation mock data
export const wrongStructure = {};
export const emailExists = {
  fullname: 'richard',
  email: 'richard@gmail.com',
  password: 'Richard@123',
  confirmPassword: 'Richard@123',
};
export const missingNameField = {
  fullname: '',
  email: 'success@gmail.com',
  password: 'Password@123',
  confirmPassword: 'Password@123',
};
export const missingEmailField = {
  fullname: 'Registration',
  email: '',
  password: 'Password@123',
  confirmPassword: 'Password@123',
};
export const invalidEmail = {
  fullname: 'Registration',
  email: 'successgmailcom',
  password: 'Password@123',
  confirmPassword: 'Password@123',
};
export const missingPasswordField = {
  fullname: 'Registration',
  email: 'success@gmail.com',
  password: '',
  confirmPassword: 'Password@123',
};
export const shortPassword = {
  fullname: 'Registration',
  email: 'success@gmail.com',
  password: 'passwo', // Less than 8 characters
  confirmPassword: 'Password@123',
};
export const notAplhanumericPassword = {
  fullname: 'Registration',
  email: 'success@gmail.com',
  password: 'password', // Missing upper case, digit, and a case character
  confirmPassword: 'Password@123',
};
export const missingConfirmPasswordField = {
  fullname: 'Registration',
  email: 'success@gmail.com',
  password: 'Password@123',
  confirmPassword: '',
};
export const passwordsNotMatching = {
  fullname: 'Registration',
  email: 'success@gmail.com',
  password: 'Password@123',
  confirmPassword: 'password',
};

// Expired Token
export const expiredToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyaWNoYXJkQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgxODQ0MDA5LCJleHAiOjE2ODE5MzA0MDl9.N23CQDKi37gu3vmOzsf8z_K6BCZspTtKNkukwZ1OM_c';

export const unSuccessfullLoginCredentials = {
  email: 'theRegisteee@gmail.com',
  password: 'Password@123',
};
export const theSuccessLoginCredentials = {
  email: 'success@gmail.com',
  password: 'Password@123',
};

export const profile = {
  gender: 'male',
  birthdate: '1985-03-30T06:22:23.855Z',
  preferredLanguage: 'Kinyarwanda',
  preferredCurrency: 'Eur',
  location: 'Karongi',
  billingAddress: 'India',
};
