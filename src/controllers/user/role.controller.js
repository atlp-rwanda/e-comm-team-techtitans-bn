import db from '../../database/models';

const Users = db.users;

class roleToSet {
  static async setRole(req, res) {
    try {
      const userId = req.params.id;
      const { email, roleId } = req.body;
      const user = await Users.findOne({ where: { id: userId } });
      if (!user) {
        res.status(404).json({
          message: '🚫 User not found',
        });
      } else {
        const updateRole = await user.update({ email, roleId });
        res.status(200).json({
          status: 'status',
          message: 'Role updated successfully',
          data: updateRole,
        });
      }
    } catch (error) {
      res.status(500).json({ status: 'fail', message: error.message });
    }
  }
}
export default roleToSet;
