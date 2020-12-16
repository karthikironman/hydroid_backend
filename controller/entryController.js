const fs = require("fs");
const jwt = require("jsonwebtoken");
const admin = require("../model/admin");
var signOptions = {
    // issuer: '',
    // subject: '',
    // audience: '',
    expiresIn: process.env.JWTexpiresIn,
    algorithm: process.env.JWTalgorithm
};
var refreshSignOptions = {
    // issuer: '',
    // subject: '',
    // audience: '',
    expiresIn: process.env.RJWTexpiresIn,
    algorithm: process.env.RJWTalgorithm
};


const loginWithEmailAndPassword = async (req, res, next) => {
    const { email_id, password } = req.body;
    let userData;
    // Validate emil & password
    if (!email_id || !password) {
        return res.status(400).send({
            success: false,
            message: "Please provide an email and password"
        });
    }
    try {
        // Check for user
        userData = await admin.findOne({ email_id }).select("+password");

        if (!userData) {
            return res
                .status(401)
                .send({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        return res
            .status(401)
            .send({ success: false, message: "Invalid credentials! Login failed" });
    }

    try {
        // Check if password matches
        const isMatch = await userData.matchPassword(password);

        if (!isMatch) {
            return res
                .status(401)
                .send({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        return res
            .status(401)
            .send({ success: false, message: "Invalid credentials! Login failed" });
    }

    let privateKEY = fs.readFileSync("./public/private.key", "utf-8");
    const token = jwt.sign(
        JSON.parse(JSON.stringify(userData)),
        privateKEY,
        signOptions
    );
    const { user_id, name, account_type, createdAt } = userData;
    const refreshToken = jwt.sign(
        JSON.parse(JSON.stringify({ email: userData.email_id })),
        privateKEY,
        refreshSignOptions
    )

    res.status(200).json({
        user_id, 
        name, 
        account_type, 
        email_id:userData.email_id,  //email_id is already defined, so exclusively including
        createdAt,
        success: true,
        token,
        refreshToken
    });
};

module.exports = {
    loginWithEmailAndPassword
}