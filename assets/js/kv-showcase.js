(function() {
    'use strict';

    // 初始化 Swiper 实例
    function initKVSwiper() {
        const swipers = document.querySelectorAll('.kv-swiper');
        swipers.forEach(slider => {
            if (!slider.swiper) {
                new Swiper(slider, {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    loop: true,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                    navigation: {
                        nextEl: slider.querySelector('.swiper-button-next'),
                        prevEl: slider.querySelector('.swiper-button-prev'),
                    },
                    pagination: {
                        el: slider.querySelector('.swiper-pagination'),
                        clickable: true,
                    }
                });
            }
        });
    }

    // 处理分类切换
    function handleFilterClick(event) {
        const filterValue = event.target.getAttribute('data-filter');
        const kvContainer = document.getElementById('kv-design-container');
        const projectGrid = document.querySelector('.project-masonry-active');

        if (filterValue === '.design') {
            kvContainer.style.display = 'block';
            projectGrid.style.display = 'none';
            initKVSwiper();
        } else {
            kvContainer.style.display = 'none';
            projectGrid.style.display = 'flex';
        }
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
        const filterButtons = document.querySelectorAll('.project-filter li');
        filterButtons.forEach(button => {
            button.addEventListener('click', handleFilterClick);
        });
    });
})(); 