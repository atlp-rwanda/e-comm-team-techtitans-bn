import db from '../../database/models';
import sendEmail from '../../utils/send.email';

const User = db.users;

const disableEnableUsers = async (req, res) => {
  const { id } = req.params;
  const { accountStatus, reason } = req.body;

  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({
        message: `User with id : ${id} does not exist `,
      });
    }

    if (user.accountStatus === accountStatus) {
      const status =
        user.accountStatus === 'active' ? 'activated' : 'deactivated';

      return res.status(409).json({
        message: `Account is already ${status}`,
      });
    }
    user.accountStatus = accountStatus;

    await user.save();

    if (user) {
      const status =
        user.accountStatus === 'active' ? 'activated' : 'deactivated';

      const to = user.email;
      const text = `Dear ${user.fullname}, Your account has been ${status} bacause of (${reason}). Please contact us if you have any further questions. 
      
        Best regards,
        
        Techtitans Admin Team`;

      sendEmail.sendEmailDisableEnable(to, 'account status', text);

      return res.status(200).json({
        message: `User Status account changed successfully: ${status}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default disableEnableUsers;
