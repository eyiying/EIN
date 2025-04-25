// 立即执行函数，检查认证状态并决定是否显示密码弹窗
(function() {
    // 立即检查本地存储中的认证状态
    const isAuth = localStorage.getItem('eindesign_auth');
    const urlParams = new URLSearchParams(window.location.search);
    const reloadParam = urlParams.get('reload');
    
    // 如果已验证或有reload参数，立即隐藏密码弹窗
    if (isAuth === 'true' || reloadParam === 'true') {
        // 添加内联样式以立即隐藏密码弹窗
        document.write('<style>#password-overlay{display:none !important;} #site-content{display:block !important;}</style>');
    }
})();

// 当文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 定义受保护的页面列表
    const protectedPages = ['/index.html', '/', '/contact.html'];

    // 当前页面路径
    const currentPath = window.location.pathname;

    // 检查是否需要密码保护
    function needsProtection() {
        return protectedPages.some(page => 
            currentPath.endsWith(page) || 
            (currentPath.endsWith('/') && page === '/')
        );
    }

    // 检查是否已验证密码
    function checkAuth() {
        // 从localStorage中获取身份验证状态
        const isAuth = localStorage.getItem('eindesign_auth');
        
        // 如果不需要保护，直接显示内容
        if (!needsProtection()) {
            if (document.getElementById('password-overlay')) {
                document.getElementById('password-overlay').style.display = 'none';
            }
            if (document.getElementById('site-content')) {
                document.getElementById('site-content').classList.remove('content-hidden');
            }
            return true;
        }
        
        // 如果需要保护但已验证，显示内容
        if (isAuth === 'true') {
            if (document.getElementById('password-overlay')) {
                document.getElementById('password-overlay').style.display = 'none';
            }
            if (document.getElementById('site-content')) {
                document.getElementById('site-content').classList.remove('content-hidden');
            }
            return true;
        }
        
        // 需要保护且未验证
        return false;
    }

    // 跳过不需要保护的页面
    if (!needsProtection()) {
        return;
    }
    
    // 检查URL参数，看是否有reload=true
    const urlParams = new URLSearchParams(window.location.search);
    const reloadParam = urlParams.get('reload');
    
    // 如果是刚刷新回来的页面，移除reload参数并开始正常显示内容
    if (reloadParam === 'true') {
        // 移除URL参数但不刷新页面
        window.history.replaceState({}, document.title, window.location.pathname);
        // 隐藏密码遮罩，显示内容
        document.getElementById('password-overlay').style.display = 'none';
        document.getElementById('site-content').classList.remove('content-hidden');
        return; // 不再执行后续检查
    }
    
    // 正常的验证状态检查
    if (checkAuth()) {
        return; // 已验证或不需要验证
    }
    
    // 使用您提供的密码哈希值 - 对应密码
    const correctPasswordHash = '7a8a13fd1a02e94c99f4bd229ca5c98981e4155dd26e6046a72a5d39160200b3';
    
    const passwordSubmit = document.getElementById('password-submit');
    const passwordInput = document.getElementById('password-input');
    const passwordError = document.getElementById('password-error');
    
    // 添加淡入效果
    const passwordBox = document.getElementById('password-box');
    passwordBox.style.opacity = '0';
    passwordBox.style.transform = 'translateY(20px)';
    passwordBox.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
        passwordBox.style.opacity = '1';
        passwordBox.style.transform = 'translateY(0)';
    }, 300);
    
    // 按钮点击事件
    passwordSubmit.addEventListener('click', function() {
        validatePassword();
    });
    
    // 回车键验证
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validatePassword();
        }
    });
    
    // 验证密码函数
    function validatePassword() {
        const inputValue = passwordInput.value.trim();
        // 计算输入值的SHA-256哈希
        const inputHash = sha256(inputValue);
        
        if (inputHash === correctPasswordHash) {
            // 密码正确，保存验证状态
            localStorage.setItem('eindesign_auth', 'true');
            
            // 显示简单的加载提示
            document.getElementById('password-box').innerHTML = `
                <p style="color: #fff; font-size: 22px; margin-bottom: 15px;">验证成功</p>
                <p style="color: rgba(255,255,255,0.7);">正在加载页面...</p>
            `;
            
            // 直接刷新页面，添加reload参数
            setTimeout(() => {
                window.location.href = window.location.pathname + '?reload=true';
            }, 800);
        } else {
            // 密码错误，显示错误信息
            passwordError.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
            
            // 错误提示震动效果
            passwordBox.style.animation = 'shake 0.5s';
            setTimeout(() => {
                passwordBox.style.animation = '';
            }, 500);
        }
    }
}); 