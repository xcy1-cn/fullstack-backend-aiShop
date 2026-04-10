const express = require("express");
const router = express.Router();
const {
    success,
    fail
} = require("../utils/response");
const products = require("../mock/products");

// 简单内存订单池，后续可替换为数据库
const orders = [];

router.post("/submit", (req, res) => {
    try {
        const {
            type,
            addressId,
            items,
            totalPrice
        } = req.body || {};

        if (!type || !["buy", "cart"].includes(type)) {
            return res.json(fail("订单类型无效", 400));
        }

        if (!addressId) {
            return res.json(fail("收货地址不能为空", 400));
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.json(fail("订单商品不能为空", 400));
        }

        const normalizedItems = items.map((item) => {
            const goodsId = Number(item.goodsId || 0);
            const goodsNum = Number(item.goodsNum || 0);
            const price = Number(item.price || 0);

            const product = products.find((p) => p.goodsId === goodsId);

            if (!product) {
                throw new Error(`商品不存在 goodsId=${goodsId}`);
            }

            if (goodsNum <= 0) {
                throw new Error(`商品数量非法 goodsId=${goodsId}`);
            }

            if (product.stock < goodsNum) {
                throw new Error(`商品库存不足 goodsId=${goodsId}`);
            }

            return {
                goodsId,
                goodsNum,
                price,
                title: product.title,
                cover: product.cover ?. [0] || "",
            };
        });

        const realTotalPrice = normalizedItems.reduce((sum, item) => {
            return sum + Number(item.price) * Number(item.goodsNum);
        }, 0);

        // 可选校验：避免前端价格被篡改
        if (Number(totalPrice) !== realTotalPrice) {
            return res.json(fail("订单金额校验失败", 400));
        }

        // 扣库存
        normalizedItems.forEach((item) => {
            const target = products.find((p) => p.goodsId === item.goodsId);
            if (target) {
                target.stock = Math.max(0, Number(target.stock || 0) - item.goodsNum);
            }
        });

        const orderId = `ORDER_${Date.now()}`;

        const order = {
            orderId,
            type,
            addressId,
            items: normalizedItems,
            totalPrice: realTotalPrice,
            status: "submitted",
            createTime: new Date().toISOString(),
        };

        orders.unshift(order);

        return res.json(
            success({
                orderId,
                totalPrice: realTotalPrice,
                status: "submitted",
            })
        );
    } catch (error) {
        return res.json(
            fail(error instanceof Error ? error.message : "提交订单失败", 500)
        );
    }
});

// 可选：订单详情，后续成功页或订单页可用
router.get("/detail", (req, res) => {
    const orderId = String(req.query.orderId || "");
    const order = orders.find((item) => item.orderId === orderId);

    if (!order) {
        return res.json(fail("订单不存在", 404));
    }

    return res.json(success(order));
});

module.exports = router;