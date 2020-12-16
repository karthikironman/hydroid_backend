const fs = require("fs");
const jwt = require("jsonwebtoken");
const admin = require("../model/admin");
var validator = require('validator');
const { v4: uuidv4 } = require('uuid');

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


const loginWithEmailAndPassword = async (req, res) => {
    const { email_id, password } = req.body;
    let userData;
    // Validate emil & password
    if (!email_id || !password) {
        return res.status(200).send({
            success: false,
            message: "Please provide an email and password",
            code: 'MISSING_FIELDS'
        });
    }
    try {
        // Check for user
        userData = await admin.findOne({ email_id }).select("+password");

        if (!userData) {
            return res
                .status(200)
                .send({
                    success: false, message: "Invalid credentials",
                    code: 'WRONG_CRED'
                });
        }
    } catch (err) {
        return res
            .status(200)
            .send({
                success: false,
                message: "Invalid credentials! Login failed",
                code: 'WRONG_CRED'
            });
    }

    try {
        // Check if password matches
        const isMatch = await userData.matchPassword(password);

        if (!isMatch) {
            return res
                .status(200)
                .send({
                    success: false,
                    message: "Invalid credentials",
                    code: 'WRONG_CRED'
                });
        }
    } catch (err) {
        return res
            .status(200)
            .send({
                success: false,
                message: "Invalid credentials! Login failed",
                code: 'WRONG_CRED'
            });
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
        email_id: userData.email_id,  //email_id is already defined, so exclusively including
        createdAt,
        success: true,
        token,
        refreshToken
    });
};

const register = async (req, res) => {
    if ('email_id' in req.body && 'password' in req.body && 'account_type' in req.body && 'name' in req.body) {
        const user_id = uuidv4();
        const { name, email_id, password, account_type } = req.body;
        const validEmail = await validator.isEmail(email_id);
        if (validEmail) {
            if (['engineer', 'admin', 'user'].includes(account_type)) {
                const isExisting = await admin.find({ email_id })
                if (isExisting.length !== 0) {
                    res.status(200).json({
                        success: false,
                        message: 'email_id is already present in the database',
                        code: 'ALREADY_REGISTERED'
                    })
                } else {
                    admin.create({ name, email_id, user_id, password, account_type })
                        .then((a) => {
                            res.status(200).json({
                                message: a,
                                success: true
                            })
                        })
                }
            }
            else {
                res.status(200).json({
                    success: false,
                    message: 'invalid account_type, it can be only engineer, admin or user',
                    code: 'WRONG_AC_TYPE'
                })
            }
        } else {
            res.status(200).json({
                success: false,
                message: 'invalid email id',
                code: 'INVALID_EMAIL'
            })
        }

    } else {
        res.status(200).json({
            success: false,
            message: 'need email_id, password, account_type, name in the body',
            code: 'MISSING_VALUES'
        })
    }

}
module.exports = {
    loginWithEmailAndPassword,
    register
}