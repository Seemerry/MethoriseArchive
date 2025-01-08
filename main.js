// 初始化轮播图
let swiper; // 声明为全局变量

// 初始化 Swiper 的函数
function initSwiper() {
    swiper = new Swiper('.swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1000,
    });
}

// 网站数据示例
const websites = [
    {
        name: "Calculating Empires",
        description: "一个大型研究可视化项目，旨在探索技术与社会结构在过去五个世纪中的共同演进。该项目追溯了自1500年以来殖民主义、军事化、自动化和圈地等技术模式，展示了这些力量如何持续发挥作用，以及可能的解构方式。该项目的核心是一幅巨大的互动式单色图表，观众可以通过缩放来追踪现代技术与权力之间的联系。",
        category: "学习教育",
        image: "./resourse/Calculating Empires.png",
        url: "https://calculatingempires.net"
    },
    {
        name: "GitHub",
        description: "全球最大的代码托管平台",
        category: "学习教育",
        image: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
        url: "https://github.com"
    },
    {
        name: "PrivacyTools",
        description: "一个致力于帮助用户提升在线隐私和数据安全的资源网站。它提供了一系列经过审核的隐私友好型工具和服务推荐，包括安全的浏览器、加密电子邮件、匿名通讯、VPN、云存储等。",
        category: "工具网站",
        image: "./resourse/privacytools.png",
        url: "https://www.privacytools.io/"
    }
];

// 渲染网站卡片
function renderWebsites(sites) {
    const container = document.querySelector('.grid');
    container.innerHTML = sites.map(site => `
        <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <img src="${site.image}" alt="${site.name}" class="w-full h-48 object-cover rounded-t-lg">
            <div class="p-4">
                <h3 class="text-lg font-semibold">${site.name}</h3>
                <p class="text-gray-600 text-sm mt-2">${site.description}</p>
                <div class="mt-4 flex justify-between items-center">
                    <a href="${site.url}" target="_blank" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">访问</a>
                    <button onclick="addToFavorites('${site.url}', '${site.name}')" class="text-gray-400 hover:text-blue-500" title="分享 ${site.name}">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 更新收藏功能，使其收藏目标网站
function addToFavorites(url, title) {
    try {
        // 尝试使用现代浏览器的 Web Share API
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            });
        } else {
            // 如果不支持 Web Share API，则提示用户使用浏览器的收藏功能
            const msg = navigator.userAgent.toLowerCase().indexOf('mac') != -1 
                ? '请按 Command + D 收藏此网站' 
                : '请按 Ctrl + D 收藏此网站';
            alert(`要收藏 ${title}，${msg}`);
            // 将焦点设置到目标网站的链接上
            window.location.href = url;
        }
    } catch (err) {
        alert(`要收藏 ${title}，请使用浏览器的收藏功能`);
    }
}

// 搜索功能
const searchInput = document.querySelector('input[type="text"]');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredSites = websites.filter(site => 
        site.name.toLowerCase().includes(searchTerm) || 
        site.description.toLowerCase().includes(searchTerm)
    );
    renderWebsites(filteredSites);
});

// 分类按钮处理
document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const activeClass = 'bg-blue-600 text-white';
    const inactiveClass = 'text-gray-600 hover:bg-gray-100';

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新按钮样式
            categoryButtons.forEach(btn => {
                btn.classList.remove(...activeClass.split(' '));
                btn.classList.add(...inactiveClass.split(' '));
            });
            button.classList.remove(...inactiveClass.split(' '));
            button.classList.add(...activeClass.split(' '));

            // 筛选网站
            const category = button.dataset.category;
            const filteredSites = category === '全部' 
                ? websites 
                : websites.filter(site => site.category === category);
            renderWebsites(filteredSites);
        });
    });

    // 初始化显示所有网站
    renderWebsites(websites);
});

// 随机选择轮播项
function getRandomSlides(count = 3) {
    return websites
        .sort(() => Math.random() - 0.5)
        .slice(0, count)
        .map(site => {
            // 根据不同网站设置不同的背景样式
            let bgStyle = '';
            if (site.name === 'GitHub') {
                bgStyle = 'bg-gradient-to-r from-gray-900 to-gray-600';
            } else if (site.name === 'PrivacyTools') {
                bgStyle = 'bg-gradient-to-r from-blue-800 to-blue-600';
            }

            return `
                <div class="swiper-slide relative">
                    ${bgStyle ? `<div class="absolute inset-0 ${bgStyle} rounded-lg"></div>` : ''}
                    <div class="h-[400px] flex items-center justify-center">
                        <img src="${site.image}" alt="${site.name}" 
                            class="w-[80%] h-[80%] object-contain ${bgStyle ? 'mix-blend-screen' : ''}"
                        >
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6 rounded-b-lg">
                        <h3 class="text-2xl font-bold mb-2">${site.name}</h3>
                        <p class="text-sm line-clamp-2">${site.description}</p>
                        <a href="${site.url}" target="_blank" class="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            访问网站
                        </a>
                    </div>
                </div>
            `;
        }).join('');
}

// 在页面加载时初始化轮播图
document.addEventListener('DOMContentLoaded', () => {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    swiperWrapper.innerHTML = getRandomSlides();
    
    // 在设置内容后初始化 Swiper
    initSwiper();
    
    // ... 其他初始化代码（分类按钮等）
    renderWebsites(websites);
}); 