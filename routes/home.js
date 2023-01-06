const express = require("express");
const router = express.Router();
const Account = require("../models/account");
// For Json input from form
const fs = require("fs");
var bodyParser = require("body-parser");
const { stringify } = require("querystring");
router.use(bodyParser.urlencoded({ extended: false }));

router.post("/login", getAccountNoID, (req, res) => {
  let cred = res.account;
  cred = cred[0];
  res.render("home", { cred });
});

// Getting all acounts in db. (ADMIN)
router.get("/all", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Making account.
router.post("/signup", async (req, res) => {
  // Check for repetition (1)
  var name = req.body.username;
  const check = await Account.find({ username: name }).exec();
  console.log(check);
  if (check.length === 0) {
    // (1)
    // Check for empty entries (2)
    if (req.body.password != null && req.body.username != null) {
      // (2)
      // Creat model Object (3)
      const account = new Account({
        username: req.body.username,
        password: req.body.password,
      });
      // (3)
      try {
        // Add to db (4)
        const newAccount = await account.save();
        // (4)
        res.status(201).json(newAccount);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    } else {
      res.status(400).json({ message: "cred empty :(" });
    }
  } else {
    res.status(500).json({ message: "Username already in use" });
  }
});

//Deleting account.
router.delete("/:id", getAccount, async (req, res) => {
  try {
    await res.account.remove();
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Middleware function to retrieve account and store in res.account
async function getAccount(req, res, next) {
  let account;
  // Search for account.
  try {
    account = await Account.findById(req.params.id);
    if (account == null) {
      res.status(404).json("cannot find account " + req.body.id);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  // Store account if found.
  res.account = account;
  // Leave function.
  next();
}

//Same as above w/ noID.
async function getAccountNoID(req, res, next) {
  let account;
  // Search for account.
  var name = req.body.username;
  var pass = req.body.password;
  console.log(name);
  console.log("inside");
  try {
    account = await Account.find({ username: name, password: pass }).exec();
    if (account == null) {
      res.status(404).json("cannot find account " + req.body.id);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  // Store account if found.
  res.account = account;
  // Leave function.
  next();
}
module.exports = router;
