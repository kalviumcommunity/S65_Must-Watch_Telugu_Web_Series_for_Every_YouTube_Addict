import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const verifyJWT = async (req, res, next) => {
    
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log(token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized request"
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log(decodedToken)

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        // console.log("user", user)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Access Token"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        // console.log(error)
        return res.status(401).json({
            success: false,
            message: "Invalid Access Token"
        });
    }
};
