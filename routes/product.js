const express = require("express");
const router = express.Router();
const {
    success,
    fail
} = require("../utils/response");
const products = require("../mock/products");
const comments = require("../mock/comments");

router.get("/detail", (req, res) => {
    const id = Number(req.query.goodsId);
    const product = products.find((item) => item.goodsId === id);

    if (!product) {
        return res.json(fail("商品不存在", 404));
    }

    res.json(success(product));
});

router.get("/comments", (req, res) => {
    const id = Number(req.query.goodsId);
    res.json(
        success({
            total: comments[id] ?.length || 0,
            list: comments[id] || [],
        })
    );
});


module.exports = router;