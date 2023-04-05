import db from '../../database/models';

const Users = db.users;

class roleToSet {
  static async setRole(req, res) {
    const { email, role } = req.body;
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send(`${email} is not found`);
    }
    user.roleId = role;
    await user.save();
    return res.status(200).send(user);
  }
}

export default roleToSet;
