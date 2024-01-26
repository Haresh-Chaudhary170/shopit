const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateProfile,
  getAllUsers,
  getUserDetails,
  updateUserDetails,
  deleteUser,
} = require("../controllers/authController");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/profile").get(isAuthenticatedUser, getUserProfile);
router.route("/profile/update").put(isAuthenticatedUser, updateProfile);
router.route("/password/change").put(isAuthenticatedUser, changePassword);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers);
router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateUserDetails)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);

module.exports = router;
