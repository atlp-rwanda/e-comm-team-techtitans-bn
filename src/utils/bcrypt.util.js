import bcrypt from 'bcrypt';

class BcryptUtility {
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async verifyPassword(password, userPassword) {
    const isValid = await bcrypt.compare(password, userPassword);
    return isValid;
  }
}
export default BcryptUtility;
