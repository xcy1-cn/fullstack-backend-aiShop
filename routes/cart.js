const express = require("express");
const router = express.Router();
const {
    success,
    fail
} = require("../utils/response");
const products = require("../mock/products");
const cartList = require("../mock/cart");

router.get("/list", (req, res) => {
    res.json(
        success({
            list: cartList,
        })
    );
});

router.get("/total", (req, res) => {
    const totalNum = cartList.reduce((sum, item) => sum + item.goodsNum, 0);
    const totalPrice = cartList.reduce(
        (sum, item) => sum + item.price * item.goodsNum,
        0
    );

    res.json(
        success({
            totalNum,
            totalPrice,
        })
    );
});

router.post("/add", (req, res) => {
    const {
        goodsId,
        goodsNum = 1
    } = req.body;
    // 补充：防止传 0、负数、NaN：
    if (!goodsId || Number(goodsNum) <= 0 || Number.isNaN(Number(goodsNum))) {
        return res.json(fail("参数错误", 400));
    }

    const product = products.find((item) => item.goodsId === Number(goodsId));

    if (!product) {
        return res.json(fail("商品不存在", 404));
    }

    const existing = cartList.find((item) => item.goodsId === Number(goodsId));

    if (existing) {
        existing.goodsNum += Number(goodsNum);
    } else {
        cartList.push({
            id: Date.now(),
            goodsId: product.id,
            title: product.title,
            price: product.price,
            goodsNum: Number(goodsNum),
            checked: true,
            cover: product.cover,
        });
    }

    res.json(success(null, "加入购物车成功"));
});

router.post("/update", (req, res) => {
    const {
        goodsId,
        goodsNum
    } = req.body;

    // 补充：防止传 0、负数、NaN：
    if (!goodsId || Number(goodsNum) <= 0 || Number.isNaN(Number(goodsNum))) {
        return res.json(fail("参数错误", 400));
    }

    const target = cartList.find((item) => item.goodsId === Number(goodsId));

    if (!target) {
        return res.json(fail("购物车商品不存在", 404));
    }

    target.goodsNum = Number(goodsNum);
    res.json(success(null, "更新成功"));
});

router.post("/remove", (req, res) => {
    const {
        goodsId
    } = req.body;

    if (!Array.isArray(goodsId) || goodsId.length === 0) {
        return res.json(fail("参数错误", 400));
    }

    const ids = goodsId.map((id) => Number(id));

    for (let i = cartList.length - 1; i >= 0; i--) {
        if (ids.includes(Number(cartList[i].goodsId))) {
            cartList.splice(i, 1);
        }
    }

    res.json(success(null, "删除成功"));
});

router.post("/clear", (req, res) => {
    cartList.splice(0, cartList.length);
    res.json(success(null, "清空成功"));
});


module.exports = router;