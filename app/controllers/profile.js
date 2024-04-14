const crypto = require("crypto");
const User = require("../models/user");
const { updateProfileSchema } = require("../validators/auth");
const { Op } = require("sequelize");

const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const userProfile = await User.findOne({ where: { id } });
    userProfile.password = undefined;
    userProfile.login_type = undefined;
    userProfile.role = undefined;
    return res
      .status(200)
      .json({ message: "Profile fetched successfully", userProfile });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    await updateProfileSchema.validateAsync(req.body);
    const { id } = req.user;
    const {
      name,
      profile_pic,
      password,
      bio,
      email,
      phone,
      confirm_password,
      old_password,
      remove_profile_pic,
      is_private
    } = req.body;
    const userProfile = await User.findOne({ where: { id } });
    if (old_password && password && password === confirm_password) {
      const encryptedOldPassword = crypto
        .createHash("sha256")
        .update(old_password)
        .digest("hex");
      if (encryptedOldPassword !== userProfile.password) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      const encryptedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      userProfile.password = encryptedPassword;
    }
    if (req.file) {
      // can upload to s3 or gcp or any other cloud storage
      const { buffer } = req.file;
      userProfile.profile_pic_buffer = buffer;
    }
    userProfile.profile_pic = profile_pic || userProfile.profile_pic;
    if (remove_profile_pic === "true") {
      userProfile.profile_pic_buffer = null;
      userProfile.profile_pic = null;
    }
    // ?? is used to check if the value is 0 then take 0 else take the previous value
    if (is_private)
      userProfile.is_private = Number(is_private) ?? userProfile.is_private;
    userProfile.name = name || userProfile.name;
    userProfile.bio = bio || userProfile.bio;
    userProfile.email = email || userProfile.email;
    userProfile.phone = phone || userProfile.phone;
    await userProfile.save();
    userProfile.password = undefined;
    return res
      .status(200)
      .json({ message: "Profile updated successfully", userProfile });
  } catch (error) {
    next(error);
  }
};

const getProfiles = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    console.log(role, id);
    let where = {};
    const attributes = {
      exclude: ["password", "id"]
    };
    // role 1 is user
    // This conditions handles the is_private condition
    // and also hides all the admins profiles from normal user
    // plus returns the profile of loggen in user even if it is private
    if (role === 1) {
      where = {
        [Op.or]: [{ [Op.and]: [{ role: 1 }, { is_private: 0 }] }, { id }]
      };
      attributes.exclude = [
        "password",
        "login_type",
        "role",
        "id",
        "deleted_at",
        "updated_at"
      ];
    }
    const users = await User.findAll({
      attributes,
      where
    });
    return res
      .status(200)
      .json({ message: "Profiles fetched successfully", users });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile, getProfiles };
