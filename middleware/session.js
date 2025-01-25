const {verifyToken} = require("../utils/handleJwt");
const {handleHttpError} = require("../utils/handleError");

const {usersModel, postsModel} = require("../models");

const authUser = async (req, res, next) => {
  // Check for authorization header
  if (!req.headers.authorization) {
    return handleHttpError(res, "No token provided", 401);
  }

  try {
    // Extract token from the authorization header (Bearer <token>)
    const token = req.headers.authorization.split(" ").pop();
    // Verify token and extract user data (e.g., _id)
    const dataToken = verifyToken(token);
  
    const id = dataToken._id;

    // Find the user by id
    const user = await usersModel.findById(id);
    if (!user) {
      return handleHttpError(res, "User not found", 404);
    }

    // Attach the user data to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();

  } catch (error) {
    console.error("Authentication Error:", error.message);
    // Handle token verification failure (e.g., invalid/expired token)
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return handleHttpError(res, "Invalid or expired token", 401);
    }
    // General error handling
    handleHttpError(res, "Authentication failed", 500);
    console.error(error);
  }
};

module.exports = { authUser };