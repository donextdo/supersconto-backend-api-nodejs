const express = require("express");

const router = express.Router();

let reviewController = require("../controllers/review");
const { AuthenticatedMiddleware } = require("../middleware/authentication");

router.post("/insert", AuthenticatedMiddleware, reviewController.addReview);
router.get("/", reviewController.getAllReview);
router.get("/:id", reviewController.getReviewById);
router.get("/getReview/:productId", reviewController.getOneReviewByProductId);
router.get("/getRating/:productId", reviewController.getRating);
router.put("/:id", reviewController.updateReviews);
router.delete("/:id", reviewController.deleteReviews);
module.exports = router;
