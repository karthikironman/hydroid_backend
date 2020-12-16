const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const admin = new mongoose.Schema(
  {
    user_id: String,
    profile_url: String,
    name: String,
    account_type: String,
    email_id: String,
    password: {
      type: String,
      minlength: 6,
      select: false
    },
    refresh_token:String,
    access_token:String
  },
  {
    timestamps: true
  }
);

admin.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
admin.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };


module.exports = mongoose.model("admin", admin);
