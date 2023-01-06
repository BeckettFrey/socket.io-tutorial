const mongoose = require("mongoose");
const accountsSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
module.exports = mongoose.model("accounts", accountsSchema);