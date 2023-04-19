import db from "../../src/database/models";
import speakeasy from "speakeasy";

export const successRegistration = {
  fullname: "Registration",
  email: "success@gmail.com",
  password: "Password@123",
  confirmPassword: "Password@123",
};
export const sellerSuccessRegistration = {
  fullname: "Registration",
  email: "seller@gmail.com",
  roleId: 2,
  password: "Password@123",
  confirmPassword: "Password@123",
};
export const unSuccessfullLoginCredentials = {
  email: "theRegisteee@gmail.com",
  password: "Password@123",
};
export const theSuccessSellerLoginCredentials = {
  email: "seller@gmail.com",
  password: "Password@123",
};

export const verifyOTP = async () => {
  const User = db.users;
  const user = await User.findOne({ where: { email: "seller@gmail.com" } });
  const secret = user.mfa_secret.replace(/\W/g, ""); // remove any non-alphanumeric characters from the OTP string
  const otp = speakeasy.totp({
    secret: secret,
    encoding: "base32",
  });
  console.log("Decrypted OTP: " + otp);
  return {
    email: "seller@gmail.com",
    otp: otp,
  };
};

export const theSuccessLoginCredentials = {
  email: "success@gmail.com",
  password: "Password@123",
};
export const profile = {
  gender: "male",
  birthdate: "1985-03-30T06:22:23.855Z",
  preferredLanguage: "Kinyarwanda",
  preferredCurrency: "Eur",
  location: "Karongi",
  billingAddress: "India",
};
