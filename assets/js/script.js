/*
* ----------------------------------------------------------------------------------------
Author       : Hridoy
Template Name: Bentos - Personal Portfolio HTML Template
Version      : 1.0                                          
* ----------------------------------------------------------------------------------------
*/

(function($) {

    "use strict";

    $(document).ready(function() {

        /*
         * ----------------------------------------------------------------------------------------
         *  EXTRA JS
         * ----------------------------------------------------------------------------------------
         */

        $('.nav-link-click').click(function() {
            $('.navbar-collapse').collapse('hide');
        });

        /*
         * ----------------------------------------------------------------------------------------
         *  PRELOADER JS & DOCUMENT LOAD JS
         * ----------------------------------------------------------------------------------------
         */

        $(window).on('load', function() {

            $('.loadersss').fadeOut();
            $('#preloader-areasss').delay(350).fadeOut('slow');


            // ## Project Filtering
            if ($('.project-masonry-active').length) {
                $(this).imagesLoaded(function() {
                    $('.project-masonry-active').isotope({
                        // options
                        itemSelector: '.item',
                    });
                });
            }


            // ## Blog Standard
            if ($('.blog-standard-wrap').length) {
                $(this).imagesLoaded(function() {
                    $('.blog-standard-wrap').isotope({
                        // options
                        itemSelector: '.item',
                    });
                });
            }





        });

        /*
         * ----------------------------------------------------------------------------------------
         *  HEADER STYLE JS
         * ----------------------------------------------------------------------------------------
         */
        function headerStyle() {
            if ($('.main-header').length) {
                var windowpos = $(window).scrollTop();
                var siteHeader = $('.main-header');
                var scrollLink = $('.scroll-top');
                if (windowpos >= 250) {
                    siteHeader.addClass('fixed-header');
                    scrollLink.fadeIn(300);
                } else {
                    siteHeader.removeClass('fixed-header');
                    scrollLink.fadeOut(300);
                }
            }
        }
        headerStyle();


        /*
         * ----------------------------------------------------------------------------------------
         *  MAGNIFIC POPUP JS
         * ----------------------------------------------------------------------------------------
         */

        var magnifPopup = function() {
            $('.work-popup').magnificPopup({
                type: 'image',
                removalDelay: 300,
                mainClass: 'mfp-with-zoom',
                gallery: {
                    enabled: true
                },
                zoom: {
                    enabled: false, // By default it's false, so don't forget to enable it

                    duration: 300, // duration of the effect, in milliseconds
                    easing: 'ease-in-out', // CSS transition easing function

                    // The "opener" function should return the element from which popup will be zoomed in
                    // and to which popup will be scaled down
                    // By defailt it looks for an image tag:
                    opener: function(openerElement) {
                        // openerElement is the element on which popup was initialized, in this case its <a> tag
                        // you don't need to add "opener" option if this code matches your needs, it's defailt one.
                        return openerElement.is('img') ? openerElement : openerElement.find('img');
                    }
                }
            });


            $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,

                fixedContentPos: false
            });

        };
        // Call the functions 
        magnifPopup();


        /*
         * ----------------------------------------------------------------------------------------
         *  SCROOL TO UP JS
         * ----------------------------------------------------------------------------------------
         */

        var progressPath = document.querySelector('.progress-wrap path');
        var pathLength = progressPath.getTotalLength();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
        progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
        var updateProgress = function() {
            var scroll = $(window).scrollTop();
            var height = $(document).height() - $(window).height();
            var progress = pathLength - (scroll * pathLength / height);
            progressPath.style.strokeDashoffset = progress;
        }
        updateProgress();
        $(window).scroll(updateProgress);
        var offset = 150;
        var duration = 550;
        jQuery(window).on('scroll', function() {
            if (jQuery(this).scrollTop() > offset) {
                jQuery('.progress-wrap').addClass('active-progress');
            } else {
                jQuery('.progress-wrap').removeClass('active-progress');
            }
        });
        jQuery('.progress-wrap').on('click', function(event) {
            event.preventDefault();
            jQuery('html, body').animate({
                scrollTop: 0
            }, duration);
            return false;
        })



        /*
         * ----------------------------------------------------------------------------------------
         *  DROPDOWN MENU JS
         * ----------------------------------------------------------------------------------------
         */
        var mobileWidth = 992;
        var navcollapse = $('.navigation li.dropdown');

        navcollapse.hover(function() {
            if ($(window).innerWidth() >= mobileWidth) {
                $(this).children('ul').stop(true, false, true).slideToggle(300);
                $(this).children('.megamenu').stop(true, false, true).slideToggle(300);
            }
        });

        // ## Submenu Dropdown Toggle
        if ($('.main-header .navigation li.dropdown ul').length) {
            $('.main-header .navigation li.dropdown').append('<div class="dropdown-btn"><span class="fas fa-chevron-down"></span></div>');

            //Dropdown Button
            $('.main-header .navigation li.dropdown .dropdown-btn').on('click', function() {
                $(this).prev('ul').slideToggle(500);
                $(this).prev('.megamenu').slideToggle(800);
            });

            //Disable dropdown parent link
            $('.navigation li.dropdown > a').on('click', function(e) {
                e.preventDefault();
            });
        }

        // Submenu Dropdown Toggle
        if ($('.main-header .main-menu').length) {
            $('.main-header .main-menu .navbar-toggle').click(function() {
                $(this).prev().prev().next().next().children('li.dropdown').hide();
            });
        }






        // ## Testimonials Active
        if ($('.testimonials-wrap').length) {
            $('.testimonials-wrap').slick({
                dots: false,
                infinite: true,
                autoplay: true,
                autoplaySpeed: 2000,
                arrows: true,
                speed: 1000,
                focusOnSelect: false,
                prevArrow: '.testimonial-prev',
                nextArrow: '.testimonial-next',
                slidesToShow: 2,
                slidesToScroll: 1,
                responsive: [{
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                    }
                }]
            });
        }



        // ## Project Filter
        $('.project-filter li').on('click', function () {
            var filterValue = $(this).attr('data-filter');
            
            // 隐藏所有特殊展示区域
            $('#kv-gallery-container').addClass('d-none');
            $('#photography-gallery-container').addClass('d-none');
            $('#packaging-gallery-container').addClass('d-none');
            $('#campaign-gallery-container').addClass('d-none');
            $('#ui-design-gallery-container').addClass('d-none');
            $('#intelligent-gallery-container').addClass('d-none');
            $('#font-design-gallery-container').addClass('d-none');
            $('#ip-design-gallery-container').addClass('d-none');
            
            // 确保所有样式都被重置
            $('.project-masonry-active').removeClass('d-none');
            
            if (filterValue === '.kv-design') {
                // 显示KV图库
                $('#kv-gallery-container').removeClass('d-none');
                $('.project-masonry-active').addClass('d-none');
            } else if (filterValue === '.ui-design') {
                // 显示UI设计图库
                $('#ui-design-gallery-container').removeClass('d-none');
                $('.project-masonry-active').addClass('d-none');
                
                // 检查是否已初始化
                if (!$('#ui-design-gallery-container').attr('data-categories-initialized')) {
                    if (typeof initializeUIDesignCategories === 'function') {
                        initializeUIDesignCategories().then(() => {
                            $('#ui-design-gallery-container').attr('data-categories-initialized', 'true');
                            // 获取第一个分类
                            const firstCategory = 'web'; // 默认使用网页设计分类
                            
                            // 更新加载按钮状态
                            const loadMoreBtn = document.getElementById('load-more-ui-design');
                            if (loadMoreBtn) {
                                loadMoreBtn.setAttribute('data-filter', firstCategory);
                                loadMoreBtn.setAttribute('data-page', '1');
                            }
                            
                            // 加载图片
                            if (typeof window.loadUIDesignImages === 'function') {
                                window.loadUIDesignImages(firstCategory, 1);
                            }
                        });
                    }
                } else {
                    // 分类已初始化，获取当前选中的分类并加载图片
                    const activeFilter = $('.ui-design-filter-buttons li.active').attr('data-filter') || 'web';
                    if (typeof window.loadUIDesignImages === 'function') {
                        window.loadUIDesignImages(activeFilter, 1);
                    }
                }
            } else if (filterValue === '.design') {
                // 显示KV showcase
                $('#kv-showcase').show();
                $('.project-masonry-active').hide();
                
                // 确保 Swiper 被正确初始化
                const swipers = document.querySelectorAll('.kv-swiper');
                swipers.forEach(slider => {
                    // 检查是否已经初始化
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
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            },
                            pagination: {
                                el: '.swiper-pagination',
                                clickable: true,
                            }
                        });
                    }
                });
                
                // 添加调试信息
                console.log('KV showcase displayed');
                console.log('Number of swipers:', swipers.length);
            } else if (filterValue === '.photography') {
                // 显示摄影图库
                $('#photography-gallery-container').removeClass('d-none');
                $('.project-masonry-active').addClass('d-none');
            } else if (filterValue === '.packaging') {
                // 显示包装设计图库
                $('#packaging-gallery-container').removeClass('d-none');
                $('.project-masonry-active').addClass('d-none');
            } else if (filterValue === '.campaign') {
                // 显示活动运营图库
                $('#campaign-gallery-container').removeClass('d-none');
                $('.project-masonry-active').addClass('d-none');
            } else if (filterValue === '.intelligent') {
                // 显示智能设计图库
                $('#intelligent-gallery-container').removeClass('d-none');
                $('.project-masonry-active').addClass('d-none');
                
                // 检查是否已初始化
                if (!$('#intelligent-gallery-container').attr('data-categories-initialized')) {
                    if (typeof initializeIntelligentCategories === 'function') {
                        initializeIntelligentCategories().then(() => {
                            $('#intelligent-gallery-container').attr('data-categories-initialized', 'true');
                            // 获取第一个分类
                            const firstCategory = 'jieri'; // 默认使用节日设计分类
                            
                            // 更新加载按钮状态
                            const loadMoreBtn = document.getElementById('load-more-intelligent');
                            if (loadMoreBtn) {
                                loadMoreBtn.setAttribute('data-filter', firstCategory);
                                loadMoreBtn.setAttribute('data-page', '1');
                            }
                            
                            // 加载图片
                            if (typeof window.loadIntelligentImages === 'function') {
                                window.loadIntelligentImages(firstCategory, 1);
                                
                                // 确保容器可见且样式正确
                                setTimeout(() => {
                                    $('#intelligent-gallery-container').css({
                                        'display': 'block',
                                        'visibility': 'visible',
                                        'opacity': '1'
                                    });
                                    
                                    // 手动触发窗口调整事件以更新布局
                                    $(window).trigger('resize');
                                    
                                    console.log('已强制显示智能设计容器并调整布局');
                                }, 300);
                            }
                        });
                    }
                } else {
                    // 分类已初始化，获取当前选中的分类并加载图片
                    const activeFilter = $('.intelligent-filter-buttons li.active').attr('data-filter') || 'jieri';
                    if (typeof window.loadIntelligentImages === 'function') {
                        window.loadIntelligentImages(activeFilter, 1);
                        
                        // 确保容器可见且样式正确
                        setTimeout(() => {
                            $('#intelligent-gallery-container').css({
                                'display': 'block',
                                'visibility': 'visible',
                                'opacity': '1'
                            });
                            
                            // 手动触发窗口调整事件以更新布局
                            $(window).trigger('resize');
                            
                            console.log('已更新智能设计布局');
                        }, 300);
                    }
                }
            } else if (filterValue === '.ip-design') {
                // 显示IP设计图库
                $('#ip-design-gallery-container').removeClass('d-none');
                $('.project-masonry-active').addClass('d-none');
                
                // 直接加载IP设计图片
                if (typeof window.loadIPDesignImages === 'function') {
                    window.loadIPDesignImages(1);
                }
            } else if (filterValue === '.font-design') {
                // 显示字体设计图库
                $('#font-design-gallery-container').removeClass('d-none');
                $('.project-masonry-active').addClass('d-none');
                
                // 直接加载字体设计图片
                if (typeof window.loadFontDesignImages === 'function') {
                    window.loadFontDesignImages(1);
                }
            } else {
                $('#kv-showcase').hide();
                $('.project-masonry-active').show();
            }
            
            $(this).addClass('current').siblings().removeClass('current');
        });



        /* ## Fact Counter + Text Count - Our Success */
        if ($('.counter-text-wrap').length) {
            $('.counter-text-wrap').appear(function() {

                var $t = $(this),
                    n = $t.find(".count-text").attr("data-stop"),
                    r = parseInt($t.find(".count-text").attr("data-speed"), 10);

                if (!$t.hasClass("counted")) {
                    $t.addClass("counted");
                    $({
                        countNum: $t.find(".count-text").text()
                    }).animate({
                        countNum: n
                    }, {
                        duration: r,
                        easing: "linear",
                        step: function() {
                            $t.find(".count-text").text(Math.floor(this.countNum));
                        },
                        complete: function() {
                            $t.find(".count-text").text(this.countNum);
                        }
                    });
                }

            }, {
                accY: 0
            });
        }



        // ## Scroll to Top
        if ($('.scroll-to-target').length) {
            $(".scroll-to-target").on('click', function() {
                var target = $(this).attr('data-target');
                // animate
                $('html, body').animate({
                    scrollTop: $(target).offset().top
                }, 1000);

            });
        }


        // ## Nice Select
        $('select').niceSelect();


        // ## WOW Animation
        if ($('.wow').length) {
            var wow = new WOW({
                boxClass: 'wow', // animated element css class (default is wow)
                animateClass: 'animated', // animation css class (default is animated)
                offset: 0, // distance to the element when triggering the animation (default is 0)
                mobile: false, // trigger animations on mobile devices (default is true)
                live: true // act on asynchronously loaded content (default is true)
            });
            wow.init();
        }


    });


    /* ==========================================================================
       When document is resize, do
       ========================================================================== */

    $(window).on('resize', function() {
        var mobileWidth = 992;
        var navcollapse = $('.navigation li.dropdown');
        navcollapse.children('ul').hide();
        navcollapse.children('.megamenu').hide();

    });


    /* ==========================================================================
       When document is scroll, do
       ========================================================================== */

    $(window).on('scroll', function() {

        // ## Header Style and Scroll to Top
        function headerStyle() {
            if ($('.main-header').length) {
                var windowpos = $(window).scrollTop();
                var siteHeader = $('.main-header');
                var scrollLink = $('.scroll-top');
                if (windowpos >= 100) {
                    siteHeader.addClass('fixed-header');
                    scrollLink.fadeIn(300);
                } else {
                    siteHeader.removeClass('fixed-header');
                    scrollLink.fadeOut(300);
                }
            }
        }

        headerStyle();

    });






    /* ==========================================================================
           SCROLLER ANIMATION
           ========================================================================== */

    const scrollers = document.querySelectorAll(".scroller");

    // If a user hasn't opted in for recuded motion, then we add the animation
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation();
    }

    function addAnimation() {
        scrollers.forEach((scroller) => {
            // add data-animated="true" to every `.scroller` on the page
            scroller.setAttribute("data-animated", true);

            // Make an array from the elements within `.scroller-inner`
            const scrollerInner = scroller.querySelector(".scroller__inner");
            const scrollerContent = Array.from(scrollerInner.children);

            // For each item in the array, clone it
            // add aria-hidden to it
            // add it into the `.scroller-inner`
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                scrollerInner.appendChild(duplicatedItem);
            });
        });
    }












    /* ==========================================================================
       When document is loaded, do
       ========================================================================== */

    $(window).on('load', function() {

        const svg = document.getElementById("preloaderSvg");
        const tl = gsap.timeline();
        const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
        const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

        tl.to(".preloader-heading .load-text , .preloader-heading .cont", {
            delay: 1.5,
            y: -100,
            opacity: 0,
        });
        tl.to(svg, {
            duration: 0.5,
            attr: { d: curve },
            ease: "power2.easeIn",
        }).to(svg, {
            duration: 0.5,
            attr: { d: flat },
            ease: "power2.easeOut",
        });
        tl.to(".preloader", {
            y: -1500,
        });
        tl.to(".preloader", {
            zIndex: -1,
            display: "none",
        });



    });

})(window.jQuery);

// 在main.js中修改这一行以匹配您的实际路径
const cloudBaseUrl = '您的实际云存储基础路径/';