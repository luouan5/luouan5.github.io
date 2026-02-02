// 图片配置 - 你可以在这里添加更多图片
const imageLibrary = {
    images: [
        {
            filename: "乖乖小猪.JPG",
            title: "美丽的风景",
            description: "这是第一张图片的描述，可以在这里添加更多详细信息。"
        },
        {
            filename: "趴趴猪.jpg",
            title: "城市夜景",
            description: "夜晚的城市灯光璀璨，展现出不一样的美丽。"
        },
        {
            filename: "小山竹.jpg",
            title: "自然风光",
            description: "大自然的鬼斧神工，让人心旷神怡。"
        },
        {
            filename: "小猪翻肚皮.jpg",
            title: "动物世界",
            description: "可爱的小动物们总是能给人带来欢乐。"
        },
        {
            filename: "小猪看风景.jpg",
            title: "艺术创作",
            description: "艺术家的创作展现了无限的想象空间。"
        },
        {
            filename: "小猪看你.jpg",
            title: "动物世界",
            description: "可爱的小动物们总是能给人带来欢乐。"
        },
        {
            filename: "小猪眯眼.jpg",
            title: "动物世界",
            description: "可爱的小动物们总是能给人带来欢乐。"
        }
        // 你可以继续添加更多图片...
    ]
};

// DOM 元素
const randomImage = document.getElementById('randomImage');
const imageTitle = document.getElementById('imageTitle');
const imageDescription = document.getElementById('imageDescription');
const totalImages = document.getElementById('totalImages');
const footerCount = document.getElementById('footerCount');
const randomBtn = document.getElementById('randomBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const autoPlayBtn = document.getElementById('autoPlayBtn');
const thumbnailGallery = document.getElementById('thumbnailGallery');
const loading = document.getElementById('loading');
const lastUpdate = document.getElementById('lastUpdate');

// 状态变量
let currentIndex = 0;
let autoPlayInterval = null;
let isAutoPlaying = false;

// 初始化
function init() {
    // 更新图片总数显示
    const total = imageLibrary.images.length;
    totalImages.textContent = total;
    footerCount.textContent = total;
    
    // 更新最后更新时间
    lastUpdate.textContent = new Date().toLocaleTimeString();
    
    // 生成缩略图
    generateThumbnails();
    
    // 显示第一张图片
    showImage(currentIndex);
    
    // 设置事件监听器
    setupEventListeners();
}

// 显示指定索引的图片
function showImage(index) {
    const imageData = imageLibrary.images[index];
    
    // 显示加载状态
    loading.style.display = 'flex';
    randomImage.style.opacity = '0';
    
    // 更新当前索引
    currentIndex = index;
    
    // 更新图片信息
    imageTitle.textContent = imageData.title;
    imageDescription.textContent = imageData.description;
    
    // 加载图片
    const img = new Image();
    img.onload = function() {
        randomImage.src = imageData.filename;
        randomImage.alt = imageData.title;
        
        // 图片加载完成后隐藏加载状态
        setTimeout(() => {
            loading.style.display = 'none';
            randomImage.style.opacity = '1';
        }, 500);
        
        // 更新缩略图选中状态
        updateThumbnailSelection();
        
        // 更新最后更新时间
        lastUpdate.textContent = new Date().toLocaleTimeString();
    };
    
    img.onerror = function() {
        loading.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 图片加载失败';
        randomImage.src = '';
    };
    
    img.src = `images/${imageData.filename}`;
}

// 生成缩略图
function generateThumbnails() {
    thumbnailGallery.innerHTML = '';
    
    imageLibrary.images.forEach((image, index) => {
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail';
        thumbnailDiv.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = `images/${image.filename}`;
        img.alt = image.title;
        img.loading = 'lazy'; // 懒加载
        
        thumbnailDiv.appendChild(img);
        thumbnailGallery.appendChild(thumbnailDiv);
        
        // 点击缩略图切换图片
        thumbnailDiv.addEventListener('click', () => {
            showImage(index);
        });
    });
}

// 更新缩略图选中状态
function updateThumbnailSelection() {
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        if (index === currentIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// 获取随机图片索引
function getRandomIndex() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * imageLibrary.images.length);
    } while (newIndex === currentIndex && imageLibrary.images.length > 1);
    return newIndex;
}

// 切换到下一张图片
function nextImage() {
    currentIndex = (currentIndex + 1) % imageLibrary.images.length;
    showImage(currentIndex);
}

// 切换到上一张图片
function prevImage() {
    currentIndex = (currentIndex - 1 + imageLibrary.images.length) % imageLibrary.images.length;
    showImage(currentIndex);
}

// 切换自动播放
function toggleAutoPlay() {
    if (isAutoPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

// 开始自动播放
function startAutoPlay() {
    autoPlayInterval = setInterval(nextImage, 3000); // 3秒切换一次
    autoPlayBtn.innerHTML = '<i class="fas fa-pause"></i> 停止播放';
    isAutoPlaying = true;
}

// 停止自动播放
function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayBtn.innerHTML = '<i class="fas fa-play"></i> 自动播放';
    isAutoPlaying = false;
}

// 设置事件监听器
function setupEventListeners() {
    // 随机按钮
    randomBtn.addEventListener('click', () => {
        const randomIndex = getRandomIndex();
        showImage(randomIndex);
    });
    
    // 上一张按钮
    prevBtn.addEventListener('click', prevImage);
    
    // 下一张按钮
    nextBtn.addEventListener('click', nextImage);
    
    // 自动播放按钮
    autoPlayBtn.addEventListener('click', toggleAutoPlay);
    
    // 键盘控制
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case ' ':
                e.preventDefault();
                const randomIndex = getRandomIndex();
                showImage(randomIndex);
                break;
            case 'a':
            case 'A':
                toggleAutoPlay();
                break;
        }
    });
    
    // 页面可见性变化时暂停/恢复自动播放
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isAutoPlaying) {
            stopAutoPlay();
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
