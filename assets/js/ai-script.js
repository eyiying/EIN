document.addEventListener('DOMContentLoaded', function() {
    // 搜索功能可以在这里添加
    
    // 图标加载失败处理
    const toolIcons = document.querySelectorAll('.tool-icon img');
    toolIcons.forEach(icon => {
        icon.addEventListener('error', function() {
            // 如果图标加载失败，使用首字母作为替代
            const toolName = this.closest('.tool-card').querySelector('h3').textContent;
            const firstLetter = toolName.charAt(0);
            
            const canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;
            const ctx = canvas.getContext('2d');
            
            // 绘制圆形背景
            ctx.fillStyle = getRandomColor();
            ctx.beginPath();
            ctx.arc(30, 30, 30, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制文字
            ctx.fillStyle = 'white';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(firstLetter, 30, 30);
            
            this.src = canvas.toDataURL();
        });
    });
    
    // 生成随机颜色
    function getRandomColor() {
        const colors = [
            '#4285F4', '#EA4335', '#FBBC05', '#34A853', // Google colors
            '#1877F2', '#E4405F', '#5851DB', '#25D366', // Social media colors
            '#0088CC', '#FF6600', '#6441A4', '#FF0000'  // More vibrant colors
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 动态调整banner-section的上边距，确保标题完全可见
    function adjustBannerPadding() {
        const header = document.querySelector('.main-header');
        const banner = document.querySelector('.banner-section');
        
        if (header && banner) {
            const headerHeight = header.offsetHeight;
            const windowWidth = window.innerWidth;
            
            // 根据屏幕宽度调整额外空间
            let extraSpace = 80; // 默认额外空间
            
            // 在宽屏下增加更多空间
            if (windowWidth > 800) {
                extraSpace = 120;
            }
            
            if (windowWidth > 992) {
                extraSpace = 140;
            }
            
            if (windowWidth > 1200) {
                extraSpace = 160;
            }
            
            banner.style.paddingTop = (headerHeight + extraSpace) + 'px';
            console.log('调整了banner内边距：', headerHeight + extraSpace, '窗口宽度：', windowWidth);
        }
    }
    
    // 页面加载后多次调整，确保导航完全渲染
    adjustBannerPadding();
    
    // 在短时间内多次调整，确保准确性
    setTimeout(adjustBannerPadding, 100);
    setTimeout(adjustBannerPadding, 500);
    setTimeout(adjustBannerPadding, 1000);
    
    window.addEventListener('resize', adjustBannerPadding);
    window.addEventListener('load', adjustBannerPadding);
    
    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        adjustBannerPadding();
    });
    
    // 监听body元素的变化
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true
    });
});