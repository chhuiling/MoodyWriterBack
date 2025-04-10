const express = require("express");
const {userRegister, userLogin,userDelete,userUpdate} = require("../controllers/users");
const {userRegisterValidator, userLoginValidator, updateUserValidator} = require("../validators/users");
const {authUser} = require("../middleware/session");
const router = express.Router();

router.post("/register", userRegisterValidator, userRegister);

router.post("/login", userLoginValidator, userLogin);

router.delete("/delete", authUser, userDelete);

router.put("/update", authUser,updateUserValidator, userUpdate);



module.exports = router;