const {Router} = require("express");
const {displayFoodData, check_out, my_orders} = require("../controllers/foodData.controller.js");
const router = Router();

router.route("/foodData").get(displayFoodData);

router.route("/checkOut").post(check_out);

router.route("/myOrders").post(my_orders)

module.exports = router;