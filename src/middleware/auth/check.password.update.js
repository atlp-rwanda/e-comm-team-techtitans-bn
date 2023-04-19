import db from '../../database/models';
import JwtUtility from '../../utils/jwt.util';
const User = db.users;
const EXPIRATION_TIME = process.env.PASSWORD_EXPIRATION_TIME;

const RestrictPassword = async (req, res, next) => {
    const tokenHeader = req.headers.authorization;
    if(!tokenHeader) {
        return res.status(401).json({
            message: 'Token not provided'
        })
    }
    const token = tokenHeader.split(" ")[1];
    try {
        const decodedToken = JwtUtility.verifyToken(token);
        
        const user = await User.findOne({where:{id: decodedToken.id}});
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