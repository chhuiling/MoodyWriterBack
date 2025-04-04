const { encrypt, compare } = require("../utils/handlePassword");
const { matchedData } = require("express-validator");
const {tokenSign} = require("../utils/handleJwt");
const {handleHttpError} = require("../utils/handleError");
const  {usersModel}  = require("../models");

const userRegister = async (req, res) => {
  try {
    const validatedData = matchedData(req); 
    const password = await encrypt(validatedData.password);
    
    const newUser = { ...validatedData, password };
    const userData = await usersModel.create(newUser);
    
    userData.password = undefined; // Hides password in response

    const data = {token: tokenSign(userData), user: userData};
    
    return res.status(201).json(data); 
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
    return res.status(200).json(data);

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


module.exports = { userRegister, userLogin, userDelete, userUpdate };
