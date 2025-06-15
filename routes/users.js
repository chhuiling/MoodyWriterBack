const express = require("express");
const {userRegister, userLogin,userDelete,userUpdate,googleSignIn, getAllUsers, sendPasswordResetEmail, checkPasswordResetToken, resetPassword} = require("../controllers/users");
const {userRegisterValidator, userLoginValidator, updateUserValidator} = require("../validators/users");
const {authUser} = require("../middleware/session");
const router = express.Router();

router.post("/register", userRegisterValidator, userRegister);

router.post("/login", userLoginValidator, userLogin);

router.delete("/delete", authUser, userDelete);

router.put("/update", authUser,updateUserValidator, userUpdate);

router.post("/googleSignIn", googleSignIn);

router.get("/all", getAllUsers )

router.get("/send-password-reset-email/:id", sendPasswordResetEmail);
router.get("/validate-password-reset-token", checkPasswordResetToken);
router.post("/reset-password", resetPassword);



module.exports = router;