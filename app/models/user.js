const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    login_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_pic: {
      type: DataTypes.TEXT("long"),
      allowNull: true
    },
    profile_pic_buffer: {
      type: DataTypes.BLOB("long"),
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT("long"),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 1
    },
    is_private: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true
  }
);

User.sync({ force: false });

module.exports = User;
