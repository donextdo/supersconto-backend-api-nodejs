const router = require("express").Router();
const passport = require("passport");

router.get("/catelog/item/", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Log in Success",
      user: req.user,
    });
  }
});

router.get("/login", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in Failure",
  });
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/v1/api/catelog/item/",
    failureRedirect: "http://localhost:3000/v1/api/users/login",
  })
);

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
