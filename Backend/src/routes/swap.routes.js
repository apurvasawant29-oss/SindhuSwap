const express = require("express");
const router = express.Router();

// TODO: import your controller once you build it
// const swapController = require("../controllers/swap.controller");

// Example placeholder route so you can verify wiring works
router.get("/", (req, res) => {
  res.json({ success: true, message: "Swap route is working" });
});

// Example structure for real endpoints later:
// router.post("/", swapController.createSwap);
// router.get("/:id", swapController.getSwapById);
// router.put("/:id", swapController.updateSwap);
// router.delete("/:id", swapController.deleteSwap);

module.exports = router;