const express = require("express");
const cors = require("cors");

const homeRoutes = require("./routes/home");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const userRoutes = require("./routes/user");
const aiRoutes = require("./routes/ai")

const app = express();
const PORT = 3001;
const path = require("path");

app.use(cors());
app.use(express.json());
// 静态托管资源
app.use("/mockImg", express.static(path.join(__dirname, "public/mockImg")));

// 健康检查
// 后端服务中添加了一个健康检查接口，用于快速判断服务状态，这在实际项目部署和调试中非常常见。
// app.get("/", (req, res) => {
//     res.json({
//         code: 200,
//         message: "Node.js mock server is running",
//     });
// });

app.get("/", (req, res) => {
    res.json({
        code: 200,
        message: "Server is running",
        time: new Date().toISOString(),
    });
});

app.use("/api/home", homeRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});