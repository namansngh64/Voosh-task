const passport = require("passport");

const router = require("express").Router();
const controller = require("../controllers/auth");

router.get("/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: JSON.stringify(req.query)
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/"
  }),
  controller.googleLogin
);

router.post("/login", controller.login);

router.post("/signup", controller.signup);

router.get("/logout", controller.logout);

module.exports = router;
