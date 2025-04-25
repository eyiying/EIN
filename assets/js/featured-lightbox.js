$(document).ready(function() {
    // 项目卡片图片数组
    var projectImages = [];
    var currentIndex = 0;
    
    // 收集所有项目卡片图片
    $('.project-card').each(function(index) {
        var imageUrl = $(this).data('image');
        if (imageUrl) {
            projectImages.push({
                url: imageUrl,
                title: $(this).find('h3').text()
            });
        }
    });
    
    // 点击项目卡片打开灯箱
    $('.project-card').on('click', function() {
        var imageUrl = $(this).data('image');
        if (!imageUrl) return;
        
        // 查找当前图片在数组中的索引
        currentIndex = projectImages.findIndex(item => item.url === imageUrl);
        console.log("当前索引:", currentIndex); // 调试信息
        
        // 更新灯箱图片
        updateLightboxImage();
        
        // 重要：重置灯箱内容区域的滚动位置到顶部
        $('.featured-lightbox-content').scrollTop(0);
        
        // 显示灯箱
        $('.featured-lightbox').addClass('active');
        $('body').addClass('lightbox-open');
    });
    
    // 关闭灯箱
    $('.featured-lightbox-close').on('click', function() {
        $('.featured-lightbox').removeClass('active');
        $('body').removeClass('lightbox-open');
    });
    
    // 点击背景也关闭灯箱
    $('.featured-lightbox').on('click', function(e) {
        if (e.target === this) {
            $(this).removeClass('active');
            $('body').removeClass('lightbox-open');
        }
    });
    
    // 上一张图片
    $('.featured-lightbox-prev').on('click', function(e) {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + projectImages.length) % projectImages.length;
        updateLightboxImage();
    });
    
    // 下一张图片
    $('.featured-lightbox-next').on('click', function(e) {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % projectImages.length;
        updateLightboxImage();
    });
    
    // 键盘导航
    $(document).keydown(function(e) {
        if (!$('.featured-lightbox').hasClass('active')) return;
        
        // 仅保留ESC键关闭功能
        if (e.keyCode === 27) { // ESC键
            $('.featured-lightbox').removeClass('active');
            $('body').removeClass('lightbox-open');
        }
    });
    
    // 更新灯箱图片
    function updateLightboxImage() {
        if (projectImages.length === 0) return;
        
        var img = $('.featured-lightbox-content img');
        img.attr('src', projectImages[currentIndex].url);
        img.attr('alt', projectImages[currentIndex].title);
        
        // 重要：重置滚动位置到顶部
        $('.featured-lightbox-content').scrollTop(0);
    }
}); 