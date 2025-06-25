const express = require("express");
const {userRegister, userLogin,userDelete,userUpdate,googleSignIn, getAllUsers, sendPasswordResetEmail, checkPasswordResetToken, resetPassword} = require("../controllers/users");
const {userRegisterValidator, userLoginValidator, updateUserValidator} = require("../validators/users");
const {authUser} = require("../middleware/session");
const router = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, surname, email, password, birthdate, gender]
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 */
router.post("/register", userRegisterValidator, userRegister);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/login", userLoginValidator, userLogin);

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/delete", authUser, userDelete);

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update the authenticated user's information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put("/update", authUser,updateUserValidator, userUpdate);

/**
 * @swagger
 * /users/googleSignIn:
 *   post:
 *     summary: Sign in or register a user with Google
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, givenName, familyName, gender, birthday]
 *             properties:
 *               email:
 *                 type: string
 *               givenName:
 *                 type: string
 *               familyName:
 *                 type: string
 *               gender:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: User signed in with Google
 */
router.post("/googleSignIn", googleSignIn);


router.get("/all", getAllUsers )

/**
 * @swagger
 * /users/send-password-reset-email/{email}:
 *   get:
 *     summary: Send password reset email to user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: User email
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.get("/send-password-reset-email/:email", sendPasswordResetEmail);

/**
 * @swagger
 * /users/validate-password-reset-token:
 *   get:
 *     summary: Validate password reset token
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     responses:
 *       200:
 *         description: Token is valid
 */
router.get("/validate-password-reset-token", checkPasswordResetToken);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post("/reset-password", resetPassword);

module.exports = router;