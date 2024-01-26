const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");

const {
  newOrder,
  getSingleOrder,
  getLoggedInUserOrders,
  getAllOrders,
} = require("../controllers/ordertController");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/my-orders").get(isAuthenticatedUser, getLoggedInUserOrders);

router.route("/admin/orders").get(isAuthenticatedUser, authorizedRoles('admin'), getAllOrders);


module.exports = router;
