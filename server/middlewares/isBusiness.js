import AuthModel from "../models/Auth.js";

const isBusiness = async (req, res, next) => {
    try {
        const user = await AuthModel.findById(req.userId);
        if (user.businessId !== null) {
            next();
        } else {
            res.status(401).json({ message: "Not a business" });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error - business middleware" });
        return;
    }
}

export default isBusiness;