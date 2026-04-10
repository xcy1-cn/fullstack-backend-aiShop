const express = require("express");
const router = express.Router();
const {
    success,
    fail
} = require("../utils/response");

function getSafeProduct(product) {
    if (!product || typeof product !== "object") return null;

    return {
        id: Number(product.id || 0),
        title: String(product.title || "该商品"),
        desc: String(product.desc || ""),
        price: Number(product.price || 0),
        originPrice: Number(product.originPrice || 0),
        sales: Number(product.sales || 0),
        stock: Number(product.stock || 0),
        cover: Array.isArray(product.cover) ? product.cover : [],
        serviceList: Array.isArray(product.serviceList) ? product.serviceList : [],
        detailImages: Array.isArray(product.detailImages) ?
            product.detailImages :
            [],
    };
}

function getSafeReviews(reviews) {
    if (!Array.isArray(reviews)) return [];

    return reviews.map((item) => ({
        username: String(item ?.username || "匿名用户"),
        content: String(item ?.content || ""),
        star: Number(item ?.star || 0),
        createTime: String(item ?.createTime || ""),
    }));
}

function calcAverageStar(reviews) {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((total, item) => total + Number(item.star || 0), 0);
    return Number((sum / reviews.length).toFixed(1));
}

router.post("/recommend", async (req, res) => {
    try {
        const query = req.body ?.query;

        if (!query || !String(query).trim()) {
            return res.json(fail("query 不能为空", 400));
        }

        let result = "";

        if (query.includes("拍照")) {
            result = `
【推荐商品】
高像素拍照手机

【推荐理由】
1. 更适合日常拍照和旅行记录
2. 夜景、人像表现更好
3. 更适合注重影像体验的用户

【适合人群】
喜欢拍照、记录生活、经常发社交媒体的用户
`;
        } else if (query.includes("游戏")) {
            result = `
【推荐商品】
高性能游戏手机

【推荐理由】
1. 处理器性能更强，适合大型游戏
2. 散热和续航表现更稳定
3. 高刷屏体验更流畅

【适合人群】
重度手游用户、注重性能体验的用户
`;
        } else {
            result = `
【推荐商品】
高性价比全能手机

【推荐理由】
1. 价格和配置更均衡
2. 适合大多数日常使用场景
3. 在预算范围内更容易买到综合表现好的产品

【适合人群】
预算明确、希望兼顾性能和日常体验的用户
`;
        }

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const chars = result.split("");
        let index = 0;

        const timer = setInterval(() => {
            if (index < chars.length) {
                res.write(chars[index]);
                index += 1;
            } else {
                clearInterval(timer);
                res.end();
            }
        }, 30);
    } catch (error) {
        console.error("mock stream error:", error);
        res.status(500).end("模拟流式返回失败");
    }
});

router.post("/review-summary", (req, res) => {
    try {
        const {
            product,
            reviews,
            reviewStats
        } = req.body || {};

        const safeProduct = getSafeProduct(product);
        const safeReviews = getSafeReviews(reviews);
        const title = safeProduct ?.title || "该商品";

        const total =
            Number(reviewStats ?.total || 0) || Number(safeReviews.length || 0);
        const averageStar =
            Number(reviewStats ?.averageStar || 0) || calcAverageStar(safeReviews);

        const hasPriceAdvantage =
            safeProduct &&
            safeProduct.price > 0 &&
            safeProduct.originPrice > 0 &&
            safeProduct.price < safeProduct.originPrice;

        const hasManyReviews = total >= 5;
        const hasHighRating = averageStar >= 4;
        const hasServiceGuarantee = (safeProduct ?.serviceList || []).length > 0;

        const pros = [];
        if (hasPriceAdvantage) pros.push("价格相对有优势");
        if (hasHighRating) pros.push("整体口碑较好");
        if (hasManyReviews) pros.push("评论反馈较丰富");
        if (hasServiceGuarantee) pros.push("服务说明相对完整");
        if (!pros.length) pros.push("基础信息较完整");

        const cons = [];
        if (total < 5) cons.push("评论样本较少");
        if (averageStar > 0 && averageStar < 3.5) cons.push("部分用户评价一般");
        if (safeProduct && safeProduct.stock <= 10) cons.push("库存相对较少");
        if (!cons.length) cons.push("仍需结合个人偏好判断");

        const suitableUsers = [];
        if (hasPriceAdvantage) suitableUsers.push("注重性价比的人群");
        if (hasHighRating) suitableUsers.push("重视用户口碑的人群");
        suitableUsers.push("日常使用需求明确的用户");

        const unsuitableUsers = [];
        if (total < 5) unsuitableUsers.push("非常依赖大量真实评价的人群");
        if (safeProduct && safeProduct.price > 5000) {
            unsuitableUsers.push("预算敏感的人群");
        }
        if (!unsuitableUsers.length) {
            unsuitableUsers.push("追求极致专业参数的人群");
        }

        const summary = `${title}整体评价${
      hasHighRating ? "较好" : "较为中性"
    }，用户主要关注价格、口碑、服务说明和实际使用体验。`;

        const suggestion =
            hasHighRating && hasPriceAdvantage ?
            "如果你更看重性价比与整体口碑，这款商品值得优先考虑。" :
            hasHighRating ?
            "如果你更重视口碑和基础体验，这款商品可以继续关注。" :
            "建议你结合个人预算、用途和评论内容，再决定是否购买。";

        return res.json(
            success({
                summary,
                pros,
                cons,
                suitableUsers,
                unsuitableUsers,
                suggestion,
            })
        );
    } catch (error) {
        console.error("review-summary error:", error);
        return res.json(fail("AI 评论总结生成失败", 500));
    }
});

router.post("/detail-qa", (req, res) => {
    try {
        const {
            product,
            reviews,
            reviewStats,
            question
        } = req.body || {};

        const q = String(question || "").trim();
        if (!q) {
            return res.json(fail("question 不能为空", 400));
        }

        const safeProduct = getSafeProduct(product);
        const safeReviews = getSafeReviews(reviews);
        const title = safeProduct ?.title || "该商品";
        const total =
            Number(reviewStats ?.total || 0) || Number(safeReviews.length || 0);
        const averageStar =
            Number(reviewStats ?.averageStar || 0) || calcAverageStar(safeReviews);

        let answer = `${title}的基础信息已获取，你可以结合价格、销量、库存和评论进一步判断。`;

        if (q.includes("送礼")) {
            answer =
                averageStar >= 4 ?
                `${title}从当前商品信息和评论口碑来看，比较适合作为送礼选择。它的整体评价较好，如果收礼人对该品类接受度高，这类商品通常更稳妥。` :
                `${title}可以作为送礼候选，但由于当前评论口碑或样本量一般，建议你再结合外观、品牌接受度和预算来判断是否适合送礼。`;
        } else if (q.includes("性价比")) {
            answer =
                safeProduct && safeProduct.originPrice > safeProduct.price ?
                `${title}当前价格为 ${safeProduct.price} 元，原价为 ${safeProduct.originPrice} 元，从现有价格信息看有一定优惠空间。若你更关注预算和日常实用性，它的性价比表现会更有吸引力。` :
                `${title}当前价格为 ${safeProduct?.price ?? 0} 元。是否有性价比，主要取决于你是否更看重价格、基础体验和评论反馈。从现有信息看，它更适合需求明确、预算清晰的购买场景。`;
        } else if (q.includes("日常")) {
            answer = `${title}更适合需求明确的日常使用场景。当前参考评论 ${total} 条，平均口碑 ${averageStar || 0} 分。如果你主要看重稳定使用、基础功能和购买风险可控，它是可以纳入考虑范围的。`;
        } else if (q.includes("不足") || q.includes("缺点")) {
            answer =
                total < 5 ?
                `从当前数据看，${title}的主要不足在于评论样本还不算多，结论稳定性有限。购买前建议重点关注商品描述、服务说明，以及是否符合你的核心需求。` :
                `从当前评论来看，${title}的主要不足更可能集中在个体使用体验差异，而不是绝对性缺陷。购买前建议重点看差评里反复出现的问题，再判断是否会影响你。`;
        } else {
            answer = `关于“${q}”，目前可以结合 ${title} 的价格、销量、库存、服务说明和评论做初步判断。如果你告诉我更具体的关注点，比如送礼、日常使用、预算或风险，我可以给出更有针对性的结论。`;
        }

        return res.json(
            success({
                answer,
            })
        );
    } catch (error) {
        console.error("detail-qa error:", error);
        return res.json(fail("AI 商品问答失败", 500));
    }
});

router.post("/decision-score", (req, res) => {
    try {
        const {
            product,
            reviews,
            metrics,
            userIntent
        } = req.body || {};

        const safeProduct = getSafeProduct(product);
        const safeReviews = getSafeReviews(reviews);

        const price = Number(safeProduct ?.price || 0);
        const originPrice = Number(safeProduct ?.originPrice || 0);
        const sales = Number(metrics ?.sales || safeProduct ?.sales || 0);
        const stock = Number(metrics ?.stock || safeProduct ?.stock || 0);
        const serviceCount = Number(
            metrics ?.serviceCount || safeProduct ?.serviceList ?.length || 0
        );
        const total = Number(metrics ?.commentsTotal || 0) || safeReviews.length;
        const averageStar =
            Number(metrics ?.averageStar || 0) || calcAverageStar(safeReviews);

        let priceScore = 7.5;
        if (price > 0 && price < 500) {
            priceScore = 9.0;
        } else if (price < 2000) {
            priceScore = 8.5;
        } else if (price < 5000) {
            priceScore = 7.8;
        } else if (price >= 5000) {
            priceScore = 7.0;
        }

        if (originPrice > 0 && price > 0 && price < originPrice) {
            priceScore += 0.4;
        }
        if (priceScore > 10) priceScore = 10;

        let reviewScore = 7.0;
        if (averageStar > 0) {
            reviewScore = Math.min(10, Math.max(6.0, averageStar * 2));
        }
        if (total >= 20) reviewScore += 0.4;
        else if (total >= 5) reviewScore += 0.2;
        if (reviewScore > 10) reviewScore = 10;

        let matchScore = 7.8;
        if (sales > 100) matchScore += 0.3;
        if (stock > 0) matchScore += 0.2;
        if (serviceCount > 0) matchScore += 0.2;
        if (userIntent && String(userIntent).includes("值得买")) {
            matchScore += 0.1;
        }
        if (matchScore > 10) matchScore = 10;

        const overallScore = Number(
            ((priceScore + reviewScore + matchScore) / 3).toFixed(1)
        );

        const risks = [];
        if (total < 5) {
            risks.push("当前评论样本较少，结论稳定性有限");
        }
        if (stock > 0 && stock <= 10) {
            risks.push("当前库存偏少，后续价格或可选性可能变化");
        }
        if (price >= 5000) {
            risks.push("商品价格较高，建议重点确认预算匹配度");
        }
        if (serviceCount === 0) {
            risks.push("服务说明较少，建议进一步确认售后与保障信息");
        }
        if (!risks.length) {
            risks.push("整体信息相对完整，仍建议结合个人需求判断是否购买");
        }

        let conclusion = "这款商品整体值得纳入考虑范围。";
        if (overallScore >= 8.5) {
            conclusion = "这款商品综合表现较好，值得优先考虑。";
        } else if (overallScore >= 7.5) {
            conclusion = "这款商品整体较均衡，适合需求明确的用户继续了解。";
        } else {
            conclusion = "这款商品可以作为候选项，但建议再对比后决定。";
        }

        return res.json(
            success({
                overallScore,
                priceScore: Number(priceScore.toFixed(1)),
                reviewScore: Number(reviewScore.toFixed(1)),
                matchScore: Number(matchScore.toFixed(1)),
                risks,
                conclusion,
            })
        );
    } catch (error) {
        console.error("decision-score error:", error);
        return res.json(fail("AI 决策评分生成失败", 500));
    }
});

module.exports = router;