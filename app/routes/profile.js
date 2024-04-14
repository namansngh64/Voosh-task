const router = require("express").Router();

const multer = require("multer");

const controller = require("../controllers/profile");
const { verifyAccessToken } = require("../utils/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
router.get("/me", verifyAccessToken, controller.getUserProfile);
router.patch(
  "/me",
  verifyAccessToken,
  upload.single("profile_pic"),
  controller.updateUserProfile
);

router.get("/profiles", verifyAccessToken, controller.getProfiles);

module.exports = router;
