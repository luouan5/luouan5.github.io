// ================================
// 图片库配置 - luouan5 的图片网站
// ================================

const imageLibrary = {
    images: [
        // 示例图片 - 请替换为你自己的图片
        {
            filename: "example1.jpg", // 你的图片文件名
            title: "示例图片 1",
            description: "这是一个示例图片。请上传你的图片到 images 文件夹，并在这里配置。"
        },
        {
            filename: "example2.jpg", // 你的图片文件名
            title: "示例图片 2", 
            description: "上传图片后，记得在 script.js 中更新文件名和描述。"
        }
        // 在这里添加更多图片...
    ]
};

// ================================
// DOM 元素引用
// ================================
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
const noImagesMessage = document.getElementById('noImagesMessage');

// ================================
// 状态变量
// ================================
let currentIndex = 0;
let autoPlayInterval = null;
let isAutoPlaying = false;
let imagesLoaded = 0;
let totalImagesToLoad = 0;

// ================================
// 初始化函数
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
    
    // 显示第一张图片
    showImage(0);
    
    // 设置事件监听器
    setupEventListeners();
    
    // 更新最后更新时间
    updateLastUpdateTime();
    
    console.log(`✅ 初始化完成，共 ${total} 张图片`);
}

// ================================
// 显示图片函数
// ================================
function showImage(index) {
    // 边界检查
    if (imageLibrary.images.length === 0) {
        showNoImagesMessage();
        return;
    }
    
    if (index < 0) index = 0;
    if (index >= imageLibrary.images.length) index = imageLibrary.images.length - 1;
    
    const imageData = imageLibrary.images[index];
    currentIndex = index;
    
    console.log(`🖼️ 显示图片: ${imageData.filename} (${index + 1}/${imageLibrary.images.length})`);
    
    // 更新UI
    imageTitle.textContent = imageData.title;
    imageDescription.textContent = imageData.description;
    
    // 显示加载状态
    loading.style.display = 'flex';
    loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载图片中...';
    randomImage.style.opacity = '0';
    
    // 构建图片路径
    // 对于 luouan5.github.io，路径是相对根目录的
    const imagePath = `images/${imageData.filename}`;
    
    // 预加载图片
    const img = new Image();
    
    img.onload = function() {
        console.log(`✅ 图片加载成功: ${imageData.filename}`);
        
        // 设置图片源
        randomImage.src = imagePath;
        randomImage.alt = imageData.title;
        
        // 图片加载完成
        setTimeout(() => {
            loading.style.display = 'none';
            randomImage.style.opacity = '1';
            
            // 更新缩略图选中状态
            updateThumbnailSelection();
            
            // 更新最后更新时间
            updateLastUpdateTime();
            
            // 添加加载成功动画
            randomImage.style.animation = 'fadeIn 0.8s ease-out';
            setTimeout(() => {
                randomImage.style.animation = '';
            }, 800);
        }, 300);
    };
    
    img.onerror = function() {
        console.error(`❌ 图片加载失败: ${imageData.filename}`);
        
        loading.innerHTML = `
            <div style="text-align: center; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle fa-2x"></i><br>
                <div style="margin-top: 10px; font-size: 14px;">
                    图片加载失败<br>
                    <small>文件: ${imageData.filename}</small><br>
                    <small>请检查 images 文件夹</small>
                </div>
            </div>
        `;
        
        // 设置一个占位图
        randomImage.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f0f0f0"/><text x="400" y="300" font-family="Arial" font-size="24" text-anchor="middle" fill="%23999">图片未找到: ' + imageData.filename + '</text></svg>';
        randomImage.alt = '图片加载失败';
        
        setTimeout(() => {
            loading.style.display = 'none';
            randomImage.style.opacity = '1';
        }, 2000);
    };
    
    // 开始加载
    img.src = imagePath;
}

// ================================
// 缩略图相关函数
// ================================
function generateThumbnails() {
    if (imageLibrary.images.length === 0) {
        thumbnailGallery.style.display = 'none';
        return;
    }
    
    thumbnailGallery.innerHTML = '';
    
    imageLibrary.images.forEach((image, index) => {
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail';
        thumbnailDiv.dataset.index = index;
        thumbnailDiv.title = `${image.title}\n点击查看大图`;
        
        const img = document.createElement('img');
        img.src = `images/${image.filename}`;
        img.alt = image.title;
        img.loading = 'lazy';
        
        // 缩略图错误处理
        img.onerror = function() {
            this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="140" viewBox="0 0 150 140"><rect width="150" height="140" fill="%23f8f9fa"/><text x="75" y="70" font-family="Arial" font-size="12" text-anchor="middle" fill="%23999">缩略图</text></svg>';
        };
        
        thumbnailDiv.appendChild(img);
        thumbnailGallery.appendChild(thumbnailDiv);
        
        // 点击事件
        thumbnailDiv.addEventListener('click', () => {
            showImage(index);
            // 添加点击反馈
            thumbnailDiv.style.transform = 'scale(0.95)';
            setTimeout(() => {
                thumbnailDiv.style.transform = '';
            }, 150);
        });
    });
}

function updateThumbnailSelection() {
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        if (index === currentIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// ================================
// 工具函数
// ================================
function getRandomIndex() {
    if (imageLibrary.images.length <= 1) return 0;
    
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * imageLibrary.images.length);
    } while (newIndex === currentIndex && imageLibrary.images.length > 1);
    
    return newIndex;
}

function nextImage() {
    if (imageLibrary.images.length === 0) return;
    
    currentIndex = (currentIndex + 1) % imageLibrary.images.length;
    showImage(currentIndex);
}

function prevImage() {
    if (imageLibrary.images.length === 0) return;
    
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

function showNoImagesMessage() {
    noImagesMessage.style.display = 'block';
    thumbnailGallery.style.display = 'none';
    imageTitle.textContent = '暂无图片';
    imageDescription.textContent = '请上传图片到 images 文件夹，并在 script.js 中配置图片信息。';
    loading.style.display = 'none';
}

// ================================
// 自动播放功能
// ================================
function toggleAutoPlay() {
    if (isAutoPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function startAutoPlay() {
    if (imageLibrary.images.length <= 1) {
        alert('至少需要2张图片才能自动播放哦！');
        return;
    }
    
    autoPlayInterval = setInterval(() => {
        nextImage();
    }, 3000); // 3秒切换
    
    autoPlayBtn.innerHTML = '<i class="fas fa-pause"></i> 停止播放';
    autoPlayBtn.classList.add('playing');
    isAutoPlaying = true;
    
    console.log('▶️ 自动播放开始');
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayBtn.innerHTML = '<i class="fas fa-play"></i> 自动播放';
    autoPlayBtn.classList.remove('playing');
    isAutoPlaying = false;
    
    console.log('⏸️ 自动播放停止');
}

// ================================
// 事件监听器
// ================================
function setupEventListeners() {
    // 随机按钮
    randomBtn.addEventListener('click', () => {
        const randomIndex = getRandomIndex();
        showImage(randomIndex);
        
        // 按钮动画
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
            case 'Escape':
                if (isAutoPlaying) stopAutoPlay();
                break;
        }
    });
    
    // 页面可见性变化时暂停自动播放
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isAutoPlaying) {
            stopAutoPlay();
        }
    });
    
    // 鼠标滚轮切换图片
    document.addEventListener('wheel', (e) => {
        if (e.deltaY > 0) {
            // 向下滚动 = 下一张
            nextImage();
        } else if (e.deltaY < 0) {
            // 向上滚动 = 上一张
            prevImage();
        }
    });
}

// ================================
// 页面加载完成后初始化
// ================================
document.addEventListener('DOMContentLoaded', init);

// ================================
// 控制台欢迎信息
// ================================
console.log(`
🌈 luouan5 的图片网站已加载！
📁 图片数量: ${imageLibrary.images.length}
🌐 网站地址: https://luouan5.github.io/
🛠️ 快捷键:
   ← →       : 切换图片
   空格       : 随机图片
   A/a       : 切换自动播放
   ESC       : 停止自动播放
  鼠标滚轮   : 切换图片
`);
