import db from '../../database/models';
import BcryptUtility from '../../utils/bcrypt.util';


const User = db.users;

const editPassword = async (req, res) => {
    const { id } = req.params
    try {
        const user = {
            ...req.body,
          };

      if (!user.old_password || !user.new_password||!user.confirm_password) {
        return res.status(401).json({
          message: 'Please fill in the old password and new password',
        });

      }
      // Find the user
      const Logged = await User.findOne({ where: { id } });
      if (!Logged) {
        return res.status(401).json({
          message: 'no user with such id',
        });
      }
      // Check if the user password matches
      const passwordMatch = await BcryptUtility.verifyPassword(user.old_password, Logged.password);
      if (!passwordMatch) {
        return res.status(401).json({
          message: 'Your old password is not correct',
        });
      }
      else{
        if(!user.new_password.match(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i
        )){
            res.status(401).json({
                message: 'Your password must contain at least 1 uppercase, 1 lowercase, 1 digit, and one case character.',
              });
        }
        //update the password
        else if(user.new_password!==user.confirm_password){
            return res.status(500).json({
                message: 'your new password does not match',
              });
        }
        else{

            Logged.password=await BcryptUtility.hashPassword(user.new_password);
            Logged.lastPasswordUpdate=new Date();
            await Logged.save();
            return res.status(200).json({
                message: 'your password was edited sucessfully',

              });
        }


      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export default editPassword
