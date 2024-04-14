const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const signupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
  confirm_password: Joi.string().valid(Joi.ref("password")).required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  profile_pic: Joi.string().optional(),
  bio: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  password: Joi.string().min(3).optional(),
  confirm_password: Joi.string().valid(Joi.ref("password")).optional(),
  old_password: Joi.string().min(3).optional(),
  remove_profile_pic: Joi.boolean().optional().allow(""),
  is_private: Joi.number().integer().min(0).max(1).optional()
});

module.exports = { loginSchema, updateProfileSchema, signupSchema };
