const express = require("express");
const router = express.Router();
const {
    success
} = require("../utils/response");
const products = require("../mock/products");
const { swiper, main, modules } = require('../mock/home')

router.get("/swiper", (req, res) => {
    res.json(
        success({
            "code": 200,
            "message": "success",
            "data": swiper
        })
    );
});

router.get("/main", (req, res) => {
    res.json(
        success({
            "code": 200,
            "message": "success",
            "data": main
        })
    );
});


router.get("/modules", (req, res) => {
    res.json(
        success({
            "code": 200,
            "message": "success",
            "data": modules
        })
    );
});


module.exports = router;