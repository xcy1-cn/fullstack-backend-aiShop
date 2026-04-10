const products = Array.from({
    length: 300
}, (_, i) => {
    const id = i + 1;

    const titles = [
        "智能手机", "蓝牙耳机", "笔记本电脑", "平板电脑", "机械键盘",
        "无线鼠标", "智能手表", "游戏手柄", "显示器", "路由器",
        "电动牙刷", "剃须刀", "吹风机", "空气炸锅", "电饭煲",
        "咖啡机", "吸尘器", "扫地机器人", "净水器", "加湿器",
        "台灯", "书桌", "人体工学椅", "书架", "背包",
        "行李箱", "运动鞋", "瑜伽垫", "哑铃", "跑步机",
        "山地自行车", "滑板", "无人机", "相机", "镜头",
        "移动硬盘", "U盘", "SSD固态硬盘", "显卡", "主板",
        "CPU处理器", "电源", "机箱", "音响", "麦克风",
        "直播设备套装", "键鼠套装", "游戏耳机", "电竞椅", "投影仪"
    ];

    const title = titles[i % titles.length] + " " + (i + 1);

    const price = Math.floor(Math.random() * 5000 + 100);
    const originPrice = price + Math.floor(Math.random() * 500 + 100);
    const typeNum = Math.floor(Math.random() * 8) + 1;
    return {
        id,
        typeNum,
        goodsId: id,
        title,
        desc: `${title}，高性价比，适合日常使用`,
        price,
        originPrice,
        cover: [
            `https://picsum.photos/300/300?random=${id}`,
        ],
        sales: Math.floor(Math.random() * 2000),
        stock: Math.floor(Math.random() * 100 + 10),
        serviceList: ["官方质保", "7天无理由退货", "快速发货"],
        detailImages: [
            `https://picsum.photos/600/400?random=${id}`,
            `https://picsum.photos/600/400?random=${id + 100}`,
        ],
    };
});

module.exports = products;