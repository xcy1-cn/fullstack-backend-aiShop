const express = require("express");
const router = express.Router();
const {
    success,
    fail
} = require("../utils/response");

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
    const {
        product,
        comments
    } = req.body || {};

    const commentTexts = Array.isArray(comments) ?
        comments.map((item) => item.content).filter(Boolean) :
        [];

    const hasPriceAdvantage =
        Number(product ?.price) > 0 && Number(product ?.price) < 2000;
    const hasManyComments = commentTexts.length >= 5;

    res.json(
        success({
            summary: `${product?.name || "该商品"}整体评价较好，用户普遍关注其价格、商品信息与实际使用体验。`,
            pros: [
                hasPriceAdvantage ? "价格相对友好" : "商品定位明确",
                "适合日常消费场景",
                hasManyComments ? "评论反馈较丰富" : "基础体验稳定",
            ],
            cons: ["部分细节仍需结合个人需求判断"],
            suitableUsers: ["注重实用性用户", "预算明确用户"],
            unsuitableUsers: ["追求极致专业体验用户"],
            suggestion: `如果你更重视${hasPriceAdvantage ? "性价比" : "商品匹配度"}，这款商品值得进一步考虑。`,
        })
    );
});

router.post("/detail-qa", (req, res) => {
    const {
        product,
        comments,
        question
    } = req.body || {};
    const q = String(question || "").trim();

    if (!q) {
        return res.status(400).json({
            message: "question 不能为空",
        });
    }

    const commentCount = Array.isArray(comments) ? comments.length : 0;
    const productName = product ?.name || "该商品";

    let answer = `${productName}的基础信息已获取。`;

    if (q.includes("送礼")) {
        answer = `${productName}从商品名称和定位来看，更偏正式消费场景。如果收礼人平时能接受该品类，并且你希望送得更稳妥正式，这类商品通常适合作为礼赠选择。`;
    } else if (q.includes("性价比")) {
        answer = `${productName}当前价格为 ${product?.price ?? 0} 元。是否有性价比，主要要看你是否更重视日常实用、品牌接受度和当前预算。从现有信息看，它更适合需求明确、预算清晰的购买场景。`;
    } else if (q.includes("日常")) {
        answer = `${productName}更适合明确用途的日常消费场景。是否适合长期日常使用，还需要结合你的使用频率、预算和对商品属性的偏好来判断。`;
    } else if (q.includes("不足") || q.includes("缺点")) {
        answer = `从当前评论数量来看，系统共参考了 ${commentCount} 条有效评论。综合来看，购买前更建议重点关注个人需求是否匹配，而不是只看单一优点。`;
    } else {
        answer = `关于“${q}”，目前可以结合商品基础信息和评论做初步判断。建议你重点查看商品价格、核心说明和用户评论，再决定是否购买。`;
    }

    res.json({
        answer,
    });
})

router.post("/decision-score", (req, res) => {
    const {
        product,
        comments,
        commentTotal
    } = req.body || {};

    const price = Number(product ?.price || 0);
    const sales = Number(product ?.sales || 0);
    const total = Number(commentTotal || 0);
    const validComments = Array.isArray(comments) ? comments : [];

    const avgCommentScore =
        validComments.length > 0 ?
        validComments.reduce((sum, item) => sum + Number(item.score || 0), 0) /
        validComments.length :
        4;

    let priceScore = 7.5;
    if (price > 0 && price < 500) {
        priceScore = 9.0;
    } else if (price < 2000) {
        priceScore = 8.5;
    } else if (price < 5000) {
        priceScore = 7.8;
    } else {
        priceScore = 7.0;
    }

    let reviewScore = Math.min(10, Math.max(6.5, avgCommentScore * 2));

    if (total > 50) {
        reviewScore += 0.3;
    }

    let matchScore = 8.0;
    if (sales > 100) {
        matchScore += 0.3;
    }
    if (product ?.summary) {
        matchScore += 0.2;
    }
    if (matchScore > 10) {
        matchScore = 10;
    }

    const overallScore = Number(
        ((priceScore + reviewScore + matchScore) / 3).toFixed(1),
    );

    const risks = [];
    if (total < 5) {
        risks.push("当前评论样本较少，结论稳定性有限");
    }
    if (!product ?.summary) {
        risks.push("商品卖点信息较少，建议结合详情描述进一步判断");
    }
    if (price > 5000) {
        risks.push("商品价格较高，建议重点确认预算匹配度");
    }
    if (risks.length === 0) {
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

    res.json({
        overallScore,
        priceScore: Number(priceScore.toFixed(1)),
        reviewScore: Number(reviewScore.toFixed(1)),
        matchScore: Number(matchScore.toFixed(1)),
        risks,
        conclusion,
    });
})

module.exports = router;