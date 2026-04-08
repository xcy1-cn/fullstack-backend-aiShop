const express = require("express");
const router = express.Router();
const {
    success,
    fail
} = require("../utils/response");
const userInfo = require("../mock/user");

router.get("/info", (req, res) => {
    const id = Number(req.query.id);
    const mobile = req.query.mobile
    const userId = userInfo.find((item) => item.user.id === id);
    if (!userId) {
        return res.json(fail("不存在此用户id", 404));
    }
    const userMobile = userInfo.find((item) => item.user.id === id && item.user.mobile === mobile);
    if (!userMobile) {
        return res.json(fail( "用户电话号码错误", 401));
    }
    const user = userInfo[userInfo.findIndex((item) => item.user.id === id)] 
    
    res.json(success(user));
});

module.exports = router;