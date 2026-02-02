// ================================
// 图片库配置
// ================================
const imageLibrary = {
    images: [
        {
            filename: "example1.jpg",
            title: "示例图片 1",
            description: "这是我的第一张图片"
        },
        {
            filename: "example2.jpg", 
            title: "示例图片 2", 
            description: "这是我的第二张图片"
        }
        // 添加更多...
    ]
};

// ================================
// DOM 元素
// ================================
const randomImage = document.getElementById('randomImage');
const imageTitle = document.getElementById('imageTitle');
const imageDescription = document.getElementById('imageDescription');
const totalImages = document.getElementById('totalImages');
const randomBtn = document.getElementById('randomBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const autoPlayBtn = document.getElementById('autoPlayBtn');
const thumbnailGallery = document.getElementById('thumbnailGallery');
const loading = document.getElementById('loading');
const lastUpdate = document.getElementById('lastUpdate');

// ================================
// 状态变量
// ================================
let currentIndex = 0;
let autoPlayInterval = null;
let isAutoPlaying = false;
let hasStarted = false; // 新增：是否已开始浏览

// ================================
// 初始化
// ================================
function init() {
    console.log('🚀 初始化图片网站...');
    
    // 更新统计信息
    const total = imageLibrary.images.length;
    totalImages.textContent = total;
    
    // 检查是否有图片
    if (total === 0) {
        showNoImagesMessage();
        return;
    }
    
    // 生成缩略图
    generateThumbnails();
    
    // 显示初始界面，不自动加载图片
    showInitialScreen();
    
    // 设置事件监听器
    setupEventListeners();
    
    console.log(`✅ 初始化完成，共 ${total} 张图片`);
}

// 显示初始界面
function showInitialScreen() {
    imageTitle.textContent = '我的图片库';
    imageDescription.textContent = `共 ${imageLibrary.images.length} 张图片，点击按钮开始浏览`;
    
    // 显示欢迎图片
    randomImage.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#667eea;stop-opacity:1" /><stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(%23grad1)"/><circle cx="400" cy="250" r="80" fill="white" opacity="0.2"/><text x="400" y="300" font-family="Arial" font-size="36" text-anchor="middle" fill="white">📸 图片库</text><text x="400" y="350" font-family="Arial" font-size="20" text-anchor="middle" fill="white" opacity="0.8">点击下方按钮开始</text></svg>';
    randomImage.alt = '点击开始浏览';
    randomImage.style.opacity = '1';
    loading.style.display = 'none';
    
    // 禁用导航按钮
    updateButtonsState(false);
    
    // 设置随机按钮为开始状态
    randomBtn.innerHTML = '<i class="fas fa-play"></i> 开始浏览';
}

// 更新按钮状态
function updateButtonsState(isEnabled) {
    prevBtn.disabled = !isEnabled;
    nextBtn.disabled = !isEnabled;
    autoPlayBtn.disabled = !isEnabled;
    
    if (!isEnabled) {
        prevBtn.style.opacity = '0.6';
        nextBtn.style.opacity = '0.6';
        autoPlayBtn.style.opacity = '0.6';
        if (isAutoPlaying) stopAutoPlay();
    } else {
        prevBtn.style.opacity = '1';
        nextBtn.style.opacity = '1';
        autoPlayBtn.style.opacity = '1';
    }
}

// ================================
// 显示图片函数
// ================================
function showImage(index) {
    if (imageLibrary.images.length === 0) return;
    
    if (index < 0) index = 0;
    if (index >= imageLibrary.images.length) index = imageLibrary.images.length - 1;
    
    const imageData = imageLibrary.images[index];
    currentIndex = index;
    
    // 如果是第一次显示图片，启用所有按钮
    if (!hasStarted) {
        hasStarted = true;
        randomBtn.innerHTML = '<i class="fas fa-random"></i> 随机换一张';
        updateButtonsState(true);
    }
    
    // 更新UI
    imageTitle.textContent = imageData.title;
    imageDescription.textContent = imageData.description;
    
    // 显示加载状态
    loading.style.display = 'flex';
    loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
    randomImage.style.opacity = '0';
    
    // 加载图片
    const imagePath = `images/${imageData.filename}`;
    const img = new Image();
    
    img.onload = function() {
        randomImage.src = imagePath;
        randomImage.alt = imageData.title;
        
        setTimeout(() => {
            loading.style.display = 'none';
            randomImage.style.opacity = '1';
            updateThumbnailSelection();
            updateLastUpdateTime();
        }, 300);
    };
    
    img.onerror = function() {
        loading.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 图片加载失败';
        randomImage.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f8f9fa"/><text x="400" y="300" font-family="Arial" font-size="24" text-anchor="middle" fill="%23666">图片加载失败</text></svg>';
        
        setTimeout(() => {
            loading.style.display = 'none';
            randomImage.style.opacity = '1';
        }, 2000);
    };
    
    img.src = imagePath;
}

// ================================
// 其他函数保持不变...
// ================================
function generateThumbnails() {
    thumbnailGallery.innerHTML = '';
    
    imageLibrary.images.forEach((image, index) => {
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail';
        thumbnailDiv.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = `images/${image.filename}`;
        img.alt = image.title;
        img.loading = 'lazy';
        
        img.onerror = function() {
            this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="140" viewBox="0 0 150 140"><rect width="150" height="140" fill="%23f8f9fa"/><text x="75" y="70" font-family="Arial" font-size="12" text-anchor="middle" fill="%23999">缩略图</text></svg>';
        };
        
        thumbnailDiv.appendChild(img);
        thumbnailGallery.appendChild(thumbnailDiv);
        
        thumbnailDiv.addEventListener('click', () => {
            if (!hasStarted) {
                // 如果还没开始，点击缩略图也视为开始
                hasStarted = true;
                randomBtn.innerHTML = '<i class="fas fa-random"></i> 随机换一张';
                updateButtonsState(true);
            }
            showImage(index);
        });
    });
}

function updateThumbnailSelection() {
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentIndex);
    });
}

function getRandomIndex() {
    if (imageLibrary.images.length <= 1) return 0;
    
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * imageLibrary.images.length);
    } while (newIndex === currentIndex && imageLibrary.images.length > 1);
    
    return newIndex;
}

function nextImage() {
    if (!hasStarted || imageLibrary.images.length === 0) return;
    currentIndex = (currentIndex + 1) % imageLibrary.images.length;
    showImage(currentIndex);
}

function prevImage() {
    if (!hasStarted || imageLibrary.images.length === 0) return;
    currentIndex = (currentIndex - 1 + imageLibrary.images.length) % imageLibrary.images.length;
    showImage(currentIndex);
}

function updateLastUpdateTime() {
    const now = new Date();
    lastUpdate.textContent = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function toggleAutoPlay() {
    if (!hasStarted) return;
    
    if (isAutoPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function startAutoPlay() {
    if (imageLibrary.images.length <= 1) return;
    
    autoPlayInterval = setInterval(() => {
        nextImage();
    }, 3000);
    
    autoPlayBtn.innerHTML = '<i class="fas fa-pause"></i> 停止播放';
    isAutoPlaying = true;
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayBtn.innerHTML = '<i class="fas fa-play"></i> 自动播放';
    isAutoPlaying = false;
}

// ================================
// 事件监听器
// ================================
function setupEventListeners() {
    // 随机/开始按钮
    randomBtn.addEventListener('click', () => {
        const randomIndex = getRandomIndex();
        showImage(randomIndex);
        
        randomBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            randomBtn.style.transform = '';
        }, 150);
    });
    
    // 上一张/下一张
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    // 自动播放
    autoPlayBtn.addEventListener('click', toggleAutoPlay);
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (!hasStarted) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextImage();
                break;
            case ' ':
                e.preventDefault();
                const randomIndex = getRandomIndex();
                showImage(randomIndex);
                break;
            case 'a':
            case 'A':
                e.preventDefault();
                toggleAutoPlay();
                break;
        }
    });
    
    // 鼠标滚轮
    document.addEventListener('wheel', (e) => {
        if (!hasStarted) return;
        
        if (e.deltaY > 0) {
            nextImage();
        } else if (e.deltaY < 0) {
            prevImage();
        }
    });
}

// ================================
// 启动
// ================================
document.addEventListener('DOMContentLoaded', init);
