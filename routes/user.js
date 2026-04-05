const express = require("express");
const router = express.Router();
const {
    success
} = require("../utils/response");
const userInfo = require("../mock/user");

router.get("/info", (req, res) => {
    res.json(success(userInfo));
});

module.exports = router;