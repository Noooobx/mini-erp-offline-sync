const express = require("express");

const router = express.Router();

const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require(
  "../controllers/customer.controller"
);

router.get("/", getCustomers);

router.post("/", createCustomer);

router.put("/:id", updateCustomer);

router.delete("/:id", deleteCustomer);

module.exports = router;