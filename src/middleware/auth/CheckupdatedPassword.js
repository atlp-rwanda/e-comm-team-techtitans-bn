import db from '../../database/models';
const User = db.users;
const EXPIRATION_TIME = process.env.PASSWORD_EXPIRATION_TIME;

const RestrictPassword = async (req, res, next) => {
    try {
        const uuidRegex = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;
        if (!uuidRegex.test(req.params.uuid)) {
            return res.status(401).json({
                message: "Your Identification number syntax is Invalid",
            });
        }
        const user= await User.findOne({where:{uuid:req.params.uuid}});
        if (!user) {
            return res.status(401).json({
                message: "Your Identification is Invalid",
            });
        }
        const lastPasswordUpdate = user.lastPasswordUpdate||user.createdAt;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() - EXPIRATION_TIME);
        if (lastPasswordUpdate < expirationDate) {
            return res.status(401).json({
                message: 'Please update your password',
              });
        }

        next()

    }
    catch (error){
        console.log(error);
        return res.status(500).json({message:'server error'});
    }
}
export default RestrictPassword;

