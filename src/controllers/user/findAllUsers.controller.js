import db from '../../database/models';

const User = db.users;

// Find all Users
const findAllUsers = (req, res) => {
  User.findAll({ where: {} })
    .then((usersList) => {
  const users=[]

        for(let i=0;i<usersList.length;i++){
            let {password,...rest}=usersList[i].dataValues
            users.push(rest)
        }

      res.status(201).json({

        message: `${usersList.length} Users were all fetched successfully!`,
        data: users
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all users.',
      });
    });
};

export default findAllUsers;
