// ================================
// 图片库配置
// ================================
const imageLibrary = {
    images: [
        {
            filename: "乖乖小猪.jpg",
            title: "乖乖小猪"
        },
        {
            filename: "趴趴猪.jpg",
            title: "趴趴猪"
        },
        {
            filename: "小山竹.jpg",
            title: "小山竹"
        },
        {
            filename: "小猪翻肚皮.jpg",
            title: "小猪翻肚皮"
        },
        {
            filename: "小猪看风景.jpg",
            title: "小猪看风景"
        },
        {
            filename: "小猪看你.jpg",
            title: "小猪看你"
        },
        {
            filename: "小猪眯眼.jpg",
            title: "小猪眯眼"
        }
        // 添加更多图片...
    ]
};

// ================================
// DOM 元素
// ================================
const randomImage = document.getElementById('randomImage');
const imageTitle = document.getElementById('imageTitle');
const currentIndexElement = document.getElementById('currentIndex');
const totalImagesElement = document.getElementById('totalImages');
const randomBtn = document.getElementById('randomBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loading = document.getElementById('loading');

// ================================
// 状态变量
// ================================
let currentIndex = 0;

// ================================
// 初始化函数
// ================================
function init() {
    console.log('🚀 初始化图片浏览器...');
    
    // 更新统计信息
    const total = imageLibrary.images.length;
    totalImagesElement.textContent = total;
    
    // 检查是否有图片
    if (total === 0) {
        showNoImagesMessage();
        return;
    }
    
    // 显示第一张图片
    showImage(currentIndex);
    
    // 设置事件监听器
    setupEventListeners();
    
    console.log(`✅ 初始化完成，共 ${total} 张图片`);
}

// ================================
// 显示图片函数
// ================================
function showImage(index) {
    // 边界检查
    if (imageLibrary.images.length === 0) return;
    
    if (index < 0) index = 0;
    if (index >= imageLibrary.images.length) index = imageLibrary.images.length - 1;
    
    // 更新当前索引
    currentIndex = index;
    
    const imageData = imageLibrary.images[index];
    
    console.log(`🖼️ 显示第 ${index + 1} 张图片: ${imageData.filename}`);
    
    // 更新UI
    imageTitle.textContent = imageData.title;
    currentIndexElement.textContent = index + 1;
    
    // 显示加载状态
    loading.style.display = 'flex';
    loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
    randomImage.style.opacity = '0';
    
    // 构建图片路径
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
        }, 300);
    };
    
    img.onerror = function() {
        console.error(`❌ 图片加载失败: ${imageData.filename}`);
        
        loading.innerHTML = `
            <div style="text-align: center; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle fa-2x"></i><br>
                <div style="margin-top: 10px; font-size: 14px;">
                    图片加载失败<br>
                    <small>文件: ${imageData.filename}</small>
                </div>
            </div>
        `;
        
        // 设置一个占位图
        randomImage.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f8f9fa"/><text x="400" y="300" font-family="Arial" font-size="24" text-anchor="middle" fill="%23999">图片加载失败</text></svg>';
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
// 图片切换函数
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

// ================================
// 事件监听器 - 只响应按钮点击
// ================================
function setupEventListeners() {
    // 上一张按钮
    prevBtn.addEventListener('click', () => {
        prevImage();
        animateButton(prevBtn);
    });
    
    // 随机按钮
    randomBtn.addEventListener('click', () => {
        const randomIndex = getRandomIndex();
        showImage(randomIndex);
        animateButton(randomBtn);
    });
    
    // 下一张按钮
    nextBtn.addEventListener('click', () => {
        nextImage();
        animateButton(nextBtn);
    });
    
    // 禁用所有键盘和鼠标滚轮事件
    document.addEventListener('keydown', (e) => {
        e.preventDefault();
    });
    
    document.addEventListener('wheel', (e) => {
        e.preventDefault();
    });
}

// 按钮动画效果
function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

// ================================
// 辅助函数
// ================================
function showNoImagesMessage() {
    imageTitle.textContent = '暂无图片';
    loading.style.display = 'none';
    randomImage.style.opacity = '1';
    randomImage.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f8f9fa"/><text x="400" y="300" font-family="Arial" font-size="24" text-anchor="middle" fill="%23666">暂无图片</text></svg>';
}

// ================================
// 启动
// ================================
document.addEventListener('DOMContentLoaded', init);

// ================================
// 控制台信息
// ================================
console.log(`
🎯 极简图片浏览器已加载
📁 图片数量: ${imageLibrary.images.length}
📝 切换方式: 仅限按钮点击
❌ 已禁用: 鼠标滚轮、键盘控制、图片描述
✅ 可用按钮: 上一张、随机、下一张
`);
