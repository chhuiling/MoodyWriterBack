const { encrypt, compare } = require("../utils/handlePassword");
const { matchedData } = require("express-validator");
const {tokenSign} = require("../utils/handleJwt");
const {handleHttpError} = require("../utils/handleError");
const  {usersModel}  = require("../models");
const { sendEmail } = require("../utils/sendMail");
const crypto = require("crypto");

const userRegister = async (req, res) => {
  try {
    const validatedData = matchedData(req); 
    const password = await encrypt(validatedData.password);
    
    const newUser = { ...validatedData, password };
    const userData = await usersModel.create(newUser);
    
    userData.password = undefined; // Hides password in response

    const data = {token: tokenSign(userData), user: userData};
    
    return res.send(data); 
  } catch (error) {
    console.error(error);
    handleHttpError(res, error);
  }
};

const userLogin = async (req,res) => {
  try{
    const validatedData = matchedData(req);
    
    const user = await usersModel.findOne({email: validatedData.email});
    if(!user) return res.status(404).json({message: "User not found"}); 

    const isPasswordValid = await compare(validatedData.password, user.password);
    if(!isPasswordValid) return res.status(401).json({message: "Invalid password"});    

    user.password = undefined;
    
    const data = {token: tokenSign(user), user: user};
    console.log(data)
    return res.send(data);

  }
  catch(error){
    console.error(error);
    handleHttpError(res, error);
  }
}

const userDelete = async (req,res) => {
  try{
    const id = req.user._id;
    console.log(id)
    const user = await usersModel.findByIdAndDelete(id)
    if(!user) return res.status(404).json({message: "User not found"})
    return res.status(200).json({message: "User deleted"})
  }
  catch(error){
    console.error(error);
    handleHttpError(res, error);
  }
}

const userUpdate = async (req,res) => {
  try{

    const id = req.user._id;
    const validatedData = matchedData(req);
    const user = await usersModel.findByIdAndUpdate(id, validatedData, {new: true});  
    if(!user) return res.status(404).json({message: "User not found"})
    return res.status(200).json(user)
  }
  catch(error){
    console.error(error);
    handleHttpError(res, error)
  }
}

const googleSignIn = async(req,res) => {
  try{
    const{email,givenName,familyName,gender,birthday} = req.body;
    if(!email) return res.status(400).json({message: "Email is required"})
    
      let user = await usersModel.findOne({email});

    if(!user){
      user = await usersModel.create({
        email: email,
        name: givenName,
        surname: familyName,
        gender: gender,
        birthdate: birthday
      })
    }

    user.password = undefined
    console.log(user)
    const data = {token: tokenSign(user), user: user}
    res.status(200).json(data)

  }
  catch(error){
    console.error(error);
    handleHttpError(res, error)
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await usersModel.find({}, { password: 0 });
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    handleHttpError(res, error);
  }
};

const sendPasswordResetEmail = async (req, res) => {
  try {
    const email = req.params.email
    const user = await usersModel.findOne({email: email})
    if (!user) {
      return handleHttpError(res, {message: "User ID not found."}, 404)
    }

    const passwordResetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = passwordResetToken
    user.resetPasswordTokenExpiration = Date.now() + 5 * 60 * 1000;
    await user.save()

    const resetPasswordUrl = `${process.env.FRONTEND_URL}reset-password?token=${passwordResetToken}`;

    sendEmail(user.email,
                "Reset your password",
                "Please click the following link to reset your password",
                resetPasswordUrl,
                "Reset Password"
        );
     res.send({ message: "Password reset email sent successfully. Please check your inbox." });

  } catch (err) {
    console.log(err)
    return handleHttpError(res, { message: "Error sending password reset email" }, 500);
  }
}

const checkPasswordResetToken = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return handleHttpError(res, { message: "Token is required to check password reset" }, 400);
        }
        const user = await usersModel.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiration: { $gt: Date.now() }
        });
        if (!user) {
            console.warn("No valid user found with provided token");
            return handleHttpError(res, { message: "Invalid or expired password reset token" }, 404);
        }
        res.send({ message: "Valid password reset token" });
    } catch (error) {
        console.error("Error checking password reset token:\n", error);
        return handleHttpError(res, { message: "Error checking password reset token" }, 500);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return handleHttpError(res, { message: "Token and new password are required to reset password" }, 400);
        }

        const user = await usersModel.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiration: { $gt: Date.now() }
        });

        if (!user) {
            console.warn("No valid user found with provided token");
            return handleHttpError(res, { message: "Invalid or expired password reset token" }, 404);
        }   

        user.password = await encrypt(newPassword);
        user.resetPasswordToken = null;
        user.resetPasswordTokenExpiration = null;
        await user.save();

        res.send({ message: "Password reset successfully. You can now log in with your new password." });
    } catch (error) {
        console.error("Error in resetting password:\n", error);
        return handleHttpError(res, { message: "Error resetting password" }, 500);
    }
};


module.exports = { userRegister, userLogin, userDelete, userUpdate, googleSignIn, getAllUsers, sendPasswordResetEmail, checkPasswordResetToken, resetPassword};
