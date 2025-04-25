/**
 * 浏览器兼容性检测和修复工具
 * @author 易颖的设计小站
 * @version 1.0.0
 */

const BrowserCompat = {
  /**
   * 存储浏览器检测结果
   */
  browser: {
    isIE: false,
    isEdge: false,
    isFirefox: false,
    isSafari: false,
    isChrome: false,
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    hasTouch: false,
    supportsPassive: false,
    supportsWebP: false
  },

  /**
   * 初始化兼容性检测
   */
  init: function() {
    this.detectBrowserFeatures();
    this.addBrowserClasses();
    
    // 当DOM加载完成后执行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.applyFixes();
        this.setupEventListeners();
        this.checkAnimationPreference();
      });
    } else {
      this.applyFixes();
      this.setupEventListeners();
      this.checkAnimationPreference();
    }
    
    // 窗口大小改变时调整布局
    window.addEventListener('resize', this.debounce(() => {
      this.adjustSize();
    }, 250));
    
    return this;
  },

  /**
   * 检测浏览器特性和能力
   */
  detectBrowserFeatures: function() {
    const ua = navigator.userAgent;
    
    // 检测浏览器类型
    this.browser.isIE = /*@cc_on!@*/false || !!document.documentMode;
    this.browser.isEdge = !this.browser.isIE && !!window.StyleMedia;
    this.browser.isFirefox = ua.indexOf('Firefox') !== -1;
    this.browser.isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    this.browser.isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    
    // 检测设备类型
    this.browser.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    this.browser.isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    this.browser.isAndroid = /Android/i.test(ua);
    
    // 检测触摸支持
    this.browser.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    
    // 检测是否支持passive事件
    try {
      const options = {
        get passive() {
          BrowserCompat.browser.supportsPassive = true;
          return true;
        }
      };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (e) {
      this.browser.supportsPassive = false;
    }
    
    // 检测WebP支持
    this.checkWebPSupport();
  },

  /**
   * 检测WebP图片格式支持
   */
  checkWebPSupport: function() {
    const img = new Image();
    img.onload = () => { this.browser.supportsWebP = true; };
    img.onerror = () => { this.browser.supportsWebP = false; };
    img.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  },

  /**
   * 向body添加基于浏览器的类
   */
  addBrowserClasses: function() {
    // 等待DOM加载完成
    const addClasses = () => {
      const { browser } = this;
      const classes = [];
      
      if (browser.isIE) classes.push('is-ie');
      if (browser.isEdge) classes.push('is-edge');
      if (browser.isFirefox) classes.push('is-firefox');
      if (browser.isSafari) classes.push('is-safari');
      if (browser.isChrome) classes.push('is-chrome');
      if (browser.isMobile) classes.push('is-mobile');
      if (browser.isIOS) classes.push('is-ios');
      if (browser.isAndroid) classes.push('is-android');
      if (browser.hasTouch) classes.push('has-touch');
      if (browser.supportsWebP) classes.push('supports-webp');
      
      // 添加类到body
      document.body.classList.add(...classes);
    };
    
    if (document.body) {
      addClasses();
    } else {
      document.addEventListener('DOMContentLoaded', addClasses);
    }
  },

  /**
   * 根据浏览器应用特定修复
   */
  applyFixes: function() {
    this.fixFirefox();
    this.fixSafari();
    this.adjustSize();
    
    // 增强触摸设备交互体验
    if (this.browser.hasTouch) {
      document.documentElement.classList.add('touch-enabled');
    }
    
    // 修复WebP图片支持
    if (!this.browser.supportsWebP) {
      this.replaceWebPImages();
    }
  },

  /**
   * Firefox特定修复
   */
  fixFirefox: function() {
    if (!this.browser.isFirefox) return;
    
    // 修复Firefox滚动流畅度
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
      }
      
      /* 修复Firefox中的一些细节问题 */
      @-moz-document url-prefix() {
        select {
          text-indent: 0.01px;
          text-overflow: '';
        }
      }
    `;
    document.head.appendChild(styleSheet);
  },

  /**
   * Safari特定修复
   */
  fixSafari: function() {
    if (!this.browser.isSafari) return;
    
    // 修复Safari中的一些细节问题
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      /* 修复Safari中输入框的圆角问题 */
      input[type="text"],
      input[type="email"],
      input[type="password"],
      input[type="search"],
      input[type="number"],
      textarea {
        -webkit-appearance: none;
        border-radius: 0;
      }
      
      /* 修复Safari中flex布局问题 */
      .flex-container {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
      }
    `;
    document.head.appendChild(styleSheet);
  },

  /**
   * 替换WebP图片为后备格式
   */
  replaceWebPImages: function() {
    const images = document.querySelectorAll('img[src$=".webp"]');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        img.src = src.replace('.webp', '.jpg');
      }
    });
    
    // 替换背景图片
    const webpBgElements = document.querySelectorAll('.webp-bg');
    webpBgElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundImage;
      if (bg.includes('.webp')) {
        el.style.backgroundImage = bg.replace('.webp', '.jpg');
      }
    });
  },

  /**
   * 调整元素大小以适应窗口
   */
  adjustSize: function() {
    const windowWidth = window.innerWidth;
    
    // 响应式字体大小
    if (windowWidth < 768) {
      document.documentElement.style.fontSize = '14px';
    } else if (windowWidth < 992) {
      document.documentElement.style.fontSize = '15px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
    
    // 调整高度为窗口高度的元素
    const fullHeightElements = document.querySelectorAll('.full-height');
    fullHeightElements.forEach(el => {
      el.style.height = `${window.innerHeight}px`;
    });
    
    // 视口单位回退解决方案
    if (this.browser.isIE) {
      this.fixVHUnits();
    }
  },

  /**
   * 修复IE中的视口高度单位
   */
  fixVHUnits: function() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // 应用修复到使用vh的元素
    const vhElements = document.querySelectorAll('[class*="vh-"]');
    vhElements.forEach(el => {
      const classes = el.className.split(' ');
      const vhClass = classes.find(c => c.startsWith('vh-'));
      
      if (vhClass) {
        const value = parseInt(vhClass.replace('vh-', ''), 10);
        el.style.height = `calc(var(--vh, 1vh) * ${value})`;
      }
    });
  },

  /**
   * 添加带有passive支持的事件监听器
   * @param {Element} element - 要监听的元素
   * @param {string} event - 事件类型
   * @param {Function} callback - 回调函数
   * @param {boolean} capture - 是否使用捕获阶段
   */
  addPassiveEventListener: function(element, event, callback, capture = false) {
    const options = this.browser.supportsPassive ? { passive: true, capture } : capture;
    element.addEventListener(event, callback, options);
  },

  /**
   * 设置事件监听器
   */
  setupEventListeners: function() {
    // 为触摸设备优化滚动行为
    if (this.browser.hasTouch) {
      this.addPassiveEventListener(document, 'touchstart', function() {}, false);
      this.addPassiveEventListener(document, 'touchmove', function() {}, false);
    }
    
    // 监听窗口大小变化优化
    window.addEventListener('resize', this.debounce(() => {
      this.adjustSize();
    }, 250));
  },

  /**
   * 检查用户对动画的偏好
   */
  checkAnimationPreference: function() {
    // 检查是否偏好减少动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionPreference = (mediaQuery) => {
      if (mediaQuery.matches) {
        this.disableAnimations();
      } else {
        this.enableAnimations();
      }
    };
    
    // 设置初始值
    handleMotionPreference(prefersReducedMotion);
    
    // 监听变化
    prefersReducedMotion.addEventListener('change', handleMotionPreference);
  },

  /**
   * 启用动画
   */
  enableAnimations: function() {
    document.documentElement.classList.remove('reduced-motion');
    document.documentElement.classList.add('animations-enabled');
  },

  /**
   * 禁用动画
   */
  disableAnimations: function() {
    document.documentElement.classList.add('reduced-motion');
    document.documentElement.classList.remove('animations-enabled');
    
    // 移除所有动画
    const animatedElements = document.querySelectorAll('.animated, [class*="fade-"], [class*="slide-"]');
    animatedElements.forEach(el => {
      el.style.animation = 'none';
      el.style.transition = 'none';
    });
  },

  /**
   * 防抖函数
   * @param {Function} func - 要执行的函数
   * @param {number} wait - 等待时间（毫秒）
   * @return {Function} 防抖处理后的函数
   */
  debounce: function(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
};

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  BrowserCompat.init();
});

// 导出模块（如果支持模块系统）
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = BrowserCompat;
} 