const products = require("./products");

const getRandomList = (arr, count = 6) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const swiper = [{
        id: 1,
        image: "http://localhost:3001/mockImg/img_1768216384778.jpg",
        link: `/product/1`,
    },
    {
        id: 2,
        image: "http://localhost:3001/mockImg/img_1768216408936.jpg",
        link: "/product/2",
    },
    {
        id: 3,
        image: "http://localhost:3001/mockImg/img_1768216568192.jpg",
        link: "/product/3",
    },
];

const main = {
    types: [{
            id: 1,
            name: "手机",
            icon: "http://localhost:3001/mockImg/img_1768216384778.jpg",
            link: "/category",
        },
        {
            id: 2,
            name: "电脑",
            icon: "http://localhost:3001/mockImg/img_1768216384778.jpg",
            link: "/category",
        },
        {
            id: 3,
            name: "耳机",
            icon: "http://localhost:3001/mockImg/img_1768216384778.jpg",
            link: "/category",
        },
        {
            id: 4,
            name: "家电",
            icon: "http://localhost:3001/mockImg/img_1768216384778.jpg",
            link: "/category",
        },
        {
            id: 5,
            name: "办公",
            icon: "http://localhost:3001/mockImg/img_1768216384778.jpg",
            link: "/category",
        },
        {
            id: 6,
            name: "运动",
            icon: "http://localhost:3001/mockImg/img_1768216384778.jpg",
            link: "/category",
        },
        {
            id: 7,
            name: "家居",
            icon: "http://localhost:3001/mockImg/img_1768216384778.jpg",
            link: "/category",
        },
        {
            id: 8,
            name: "配件",
            icon: "http://localhost:3001/mockImg/img_1768216384778.jpg",
            link: "/category",
        },
    ],
    recommend: [{
            id: 1,
            image: "http://localhost:3001/mockImg/img_1768216384778.jpg",
            link: "/activity/1",
        },
        {
            id: 2,
            image: "http://localhost:3001/mockImg/img_1768216384778.jpg",
            link: "/activity/2",
        },
    ],
};

const modules = [{
        type: "hot",
        id: 1,
        title: "热门推荐",
        subtitle: "大家都在买",
        goodsList: getRandomList(products, 6),
    },
    {
        type: "digit",
        id: 2,
        title: "数码好物",
        subtitle: "精选配件",
        goodsList: getRandomList(products, 6),
    },
];

module.exports = {
    swiper,
    main,
    modules,
};