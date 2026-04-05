const products = [{
        id: 1,
        title: "Apple iPhone 15 Pro",
        desc: "A17 Pro 芯片，钛金属机身",
        price: 7999,
        originPrice: 8999,
        cover: "http://localhost:3001/mockImg/img_1768216408936.jpg",
        sales: 1200,
        stock: 50,
        serviceList: ["7天无理由退货", "48小时发货", "官方质保"],
        detailImages: [
            "http://localhost:3001/mockImg/img_1768216423626.jpg",
        ],
    },
    {
        id: 2,
        title: "Sony WH-1000XM5",
        desc: "高端降噪耳机",
        price: 2399,
        originPrice: 2699,
        cover: "http://localhost:3001/mockImg/img_1768216547332.jpg",
        sales: 680,
        stock: 35,
        serviceList: ["官方质保", "顺丰包邮"],
        detailImages: [
            "http://localhost:3001/mockImg/img_1768216547332.jpg",
        ],
    },
];

module.exports = products;