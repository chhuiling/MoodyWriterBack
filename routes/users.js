const express = require("express");
const {userRegister, userLogin,userDelete} = require("../controllers/users");
const {userRegisterValidator, userLoginValidator} = require("../validators/users");
const {authUser} = require("../middleware/session");
const router = express.Router();

router.post("/register", userRegisterValidator, userRegister);

router.post("/login", userLoginValidator, userLogin);

router.delete("/delete", authUser, userDelete);



module.exports = router;