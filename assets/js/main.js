document.addEventListener('DOMContentLoaded', function() {
    console.log('执行索引扩展和性能优化');
    
    // 将所有文件夹最大索引设置为100
    window.kvFolderMaxIndex = {
        'handdrawn': 100,
        '3d': 100,
        'design': 100,
        'poster': 100,
        'interface': 100,
        'other': 100
    };
    
    // 将所有摄影分类最大索引设置为100
    window.photographyFolderMaxIndex = {
        'travel': 100,
        'portrait': 100,
        'street': 100,
        'architecture': 100,
        'nature': 100
    };
    
    // 添加包装设计分类最大索引
    window.packagingFolderMaxIndex = {
        'food': 100,
        'daily': 100,
        'pattern': 100
    };
    
    // 两个不同的云存储基础URL
    const kvCloudBaseUrl = 'https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/kv/';
    const photographyCloudBaseUrl = 'https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/photograph/'; // 修正拼写错误，从photogragh改为photograph
    const packagingCloudBaseUrl = 'https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/packaging/'; // 添加包装设计云存储URL
    
    // KV设计文件夹映射
    const folderDisplayNames = {
        'handdrawn': '手绘',  
        'aigc': 'AIGC',
        '3d': '3D',
        '2.5d': '2.5D',
        'pingmian': '平面',
        'jianyue': '简约',
    };
    
    // 摄影分类映射
    const photographyFolderDisplayNames = {
        'travel': '旅行',
        'portrait': '人像',
        'street': '街拍',
        'architecture': '建筑',
        'nature': '自然',
    };
    
    // 包装设计分类映射
    const packagingFolderDisplayNames = {
        'food': '食品包装',
        'daily': '日用品包装',
        'pattern': '图案设计'
    };
    
    // 仅初始化必要元素，不改变现有布局
    function ensureGridElements(selector) {
        const gridGallery = document.querySelector(selector);
        if (!gridGallery) return;
        
        // 不添加额外的样式或元素，只检查容器是否存在
        console.log(`确认网格容器: ${selector}`);
        return gridGallery;
    }
    
    // 统一图片加载函数
    window.loadImages = function(options) {
        const config = {
            category: '',        // 'kv' 或 'photography' 或 'packaging'
            filter: '',          // 文件夹或分类名称
            page: 1,             // 当前页码
            cloudBaseUrl: 'https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/', // 云存储基础URL
            useCloud: true,      // 是否使用云存储
            ...options
        };
        
        // 添加防重复加载保护
        const loadingKey = `${config.category}-${config.filter}-${config.page}`;
        if (window.currentlyLoading === loadingKey) {
            console.log(`已在加载: ${loadingKey}, 忽略重复请求`);
            return;
        }
        window.currentlyLoading = loadingKey;
        
        console.log(`加载图片: 分类=${config.category}, 过滤器=${config.filter}, 页码=${config.page}, 使用云=${config.useCloud}`);
        
        // 获取关键DOM元素
        const gridSelector = config.category === 'kv' ? '.kv-grid-gallery' : 
                            (config.category === 'photography' ? '.photography-grid-gallery' : '.packaging-grid-gallery');
        const gridGallery = document.querySelector(gridSelector);
        const buttonId = config.category === 'kv' ? 'load-more-kv' : 
                        (config.category === 'photography' ? 'load-more-photography' : 'load-more-packaging');
        const loadMoreBtn = document.getElementById(buttonId);
        const loadingIndicator = document.querySelector('.loading-indicator');
        
        if (!gridGallery) {
            console.error(`找不到网格容器: ${gridSelector}`);
            return;
        }
        
        // 更新按钮状态
        if (loadMoreBtn) {
            loadMoreBtn.textContent = '加载中...';
            loadMoreBtn.disabled = true;
            loadMoreBtn.setAttribute('data-page', config.page);
            loadMoreBtn.setAttribute('data-filter', config.filter);
        }
        
        // 显示加载指示器
        if (loadingIndicator) {
            loadingIndicator.classList.remove('d-none');
        }
        
        // 如果是第一页，清空网格内容
        if (config.page === 1) {
            gridGallery.innerHTML = '';
        }
        
        // 计算要加载的图片范围
        const perPage = 12; // 每页图片数
        const startIndex = (config.page - 1) * perPage + 1;
        
        // 获取最大索引
        const maxIndexObj = config.category === 'kv' ? window.kvFolderMaxIndex : 
                           (config.category === 'photography' ? window.photographyFolderMaxIndex : window.packagingFolderMaxIndex);
        const maxIndex = maxIndexObj && maxIndexObj[config.filter] ? maxIndexObj[config.filter] : 100; // 默认100
        
        const endIndex = Math.min(startIndex + perPage - 1, maxIndex);
        console.log(`加载范围: ${startIndex} 到 ${endIndex}, 最大索引: ${maxIndex}`);
        
        // 如果没有更多图片可加载
        if (startIndex > maxIndex) {
            if (loadMoreBtn) {
                loadMoreBtn.textContent = '没有更多图片了';
                loadMoreBtn.disabled = true;
            }
            
            if (loadingIndicator) {
                loadingIndicator.classList.add('d-none');
            }
            return;
        }
        
        // 性能优化: 使用DocumentFragment减少DOM操作
        const fragment = document.createDocumentFragment();
        
        // 创建图片加载任务
        const loadTasks = [];
        let successCount = 0;
        
        for (let i = startIndex; i <= endIndex; i++) {
            // 构建图片URL - 根据分类和是否使用云存储
            let imgUrl;
            let fullImgUrl; // 用于存储高清大图URL
            
            if (config.useCloud) {
                // 云存储路径
                if (config.category === 'kv') {
                    imgUrl = `${config.cloudBaseUrl}kv/${config.filter}/${config.filter}kv${i}.jpg`;
                } else if (config.category === 'photography') {
                    imgUrl = `${config.cloudBaseUrl}photograph/${config.filter}/${config.filter}${i}.jpg`;
                } else if (config.category === 'packaging') {
                    imgUrl = `${config.cloudBaseUrl}packaging/${config.filter}/${config.filter}${i}.jpg`;
                    // 对于food和daily分类，添加_full后缀的大图URL
                    if (config.filter === 'food' || config.filter === 'daily') {
                        fullImgUrl = `${config.cloudBaseUrl}packaging/${config.filter}/${config.filter}${i}_full.jpg`;
                    } else {
                        fullImgUrl = imgUrl; // pattern分类没有_full后缀
                    }
                }
            } else {
                // 本地路径
                imgUrl = `assets/images/${config.category}/${config.filter}/${i}.jpg`;
                if (config.category === 'packaging' && (config.filter === 'food' || config.filter === 'daily')) {
                    fullImgUrl = `assets/images/${config.category}/${config.filter}/${i}_full.jpg`;
                } else {
                    fullImgUrl = imgUrl;
                }
            }
            
            // 创建图片加载Promise
            loadTasks.push(new Promise(resolve => {
                const img = new Image();
                
                // 性能优化: 添加解码操作
                img.onload = function() {
                    successCount++;
                    console.log(`图片加载成功: ${imgUrl}`);
                    
                    // 尝试解码图片以提高渲染性能
                    if ('decode' in img) {
                        img.decode().then(() => {
                            resolve({success: true, url: imgUrl, fullUrl: fullImgUrl, element: img});
                        }).catch(err => {
                            console.warn(`图片解码失败: ${imgUrl}`, err);
                            resolve({success: true, url: imgUrl, fullUrl: fullImgUrl, element: img});
                        });
                    } else {
                        resolve({success: true, url: imgUrl, fullUrl: fullImgUrl, element: img});
                    }
                };
                
                img.onerror = function() {
                    console.warn(`图片加载失败: ${imgUrl}`);
                    resolve({success: false, url: imgUrl});
                };
                
                img.src = imgUrl;
            }));
        }
        
        // 处理所有图片加载任务
        Promise.all(loadTasks).then(results => {
            // 过滤出成功加载的图片
            const successResults = results.filter(result => result.success);
            
            // 如果没有成功加载的图片
            if (successResults.length === 0) {
                console.warn('没有成功加载的图片');
                if (loadMoreBtn) {
                    loadMoreBtn.textContent = '没有更多图片了';
                    loadMoreBtn.disabled = true;
                }
                
                if (loadingIndicator) {
                    loadingIndicator.classList.add('d-none');
                }
                
                window.currentlyLoading = null;
                return;
            }
            
            // 创建并添加图片元素到网格
            successResults.forEach((result, index) => {
                // 创建网格项
                const gridItem = document.createElement('div');
                gridItem.className = config.category === 'kv' ? 'kv-grid-item' : 
                                    (config.category === 'photography' ? 'photography-grid-item' : 'packaging-grid-item');
                gridItem.setAttribute('data-index', startIndex + index);
                
                // 创建内容容器
                const itemContent = document.createElement('div');
                itemContent.className = config.category === 'kv' ? 'kv-grid-item-content' : 
                                       (config.category === 'photography' ? 'photography-grid-item-content' : 'packaging-grid-item-content');
                
                // 创建图片元素
                const imgElement = document.createElement('img');
                imgElement.src = result.url;
                imgElement.alt = `${config.filter} ${startIndex + index}`;
                
                // 组装DOM结构
                itemContent.appendChild(imgElement);
                gridItem.appendChild(itemContent);
                fragment.appendChild(gridItem);
                
                // 添加点击事件
                gridItem.addEventListener('click', function() {
                    // 打开灯箱
                    if (config.category === 'packaging' && (config.filter === 'food' || config.filter === 'daily')) {
                        openLightbox(result.fullUrl, startIndex + index, true, config.category, config.filter);
                    } else {
                        openLightbox(result.url, startIndex + index, false, config.category, config.filter);
                    }
                });
            });
            
            // 一次性添加所有元素到DOM
            gridGallery.appendChild(fragment);
            
            // 更新加载按钮状态
            if (loadMoreBtn) {
                loadMoreBtn.textContent = '加载更多';
                loadMoreBtn.disabled = false;
                loadMoreBtn.setAttribute('data-page', config.page);
                loadMoreBtn.setAttribute('data-filter', config.filter);
                
                // 如果已经加载到最后一页
                if (endIndex >= maxIndex) {
                    loadMoreBtn.textContent = '没有更多图片了';
                    loadMoreBtn.disabled = true;
                }
            }
            
            // 隐藏加载指示器
            if (loadingIndicator) {
                loadingIndicator.classList.add('d-none');
            }
            
            console.log(`成功加载 ${successResults.length} 张图片`);
            
            // 清除加载状态
            window.currentlyLoading = null;
        });
    };
    
    // 兼容原有函数
    window.loadKVImages = function(folder, page) {
        window.loadImages({
            category: 'kv',
            filter: folder,
            page: page
        });
    };
    
    window.loadPhotographyImages = function(filter, page) {
        window.loadImages({
            category: 'photography',
            filter: filter,
            page: page
        });
    };
    
    // 添加包装设计图片加载函数
    window.loadPackagingImages = function(filter, page) {
        console.log(`加载包装设计图片: 分类=${filter}, 页码=${page}`);
        window.loadImages({
            category: 'packaging',
            filter: filter,
            page: page
        });
    };
    
    // 为所有加载更多按钮添加点击事件
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'load-more-kv') {
            const btn = e.target;
            const folder = btn.getAttribute('data-filter') || 'handdrawn';
            const page = parseInt(btn.getAttribute('data-page') || '1') + 1;
            
            console.log(`KV加载更多按钮点击: 文件夹=${folder}, 页码=${page}`);
            window.loadKVImages(folder, page);
            
            // 阻止事件进一步传播，避免多次触发
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (e.target && e.target.id === 'load-more-photography') {
            const btn = e.target;
            const filter = btn.getAttribute('data-filter') || 'travel';
            const page = parseInt(btn.getAttribute('data-page') || '1') + 1;
            
            console.log(`摄影加载更多按钮点击: 分类=${filter}, 页码=${page}`);
            window.loadPhotographyImages(filter, page);
            
            // 阻止事件进一步传播，避免多次触发
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (e.target && e.target.id === 'load-more-packaging') {
            const btn = e.target;
            const filter = btn.getAttribute('data-filter') || 'food';
            const page = parseInt(btn.getAttribute('data-page') || '1') + 1;
            
            console.log(`包装设计加载更多按钮点击: 分类=${filter}, 页码=${page}`);
            window.loadPackagingImages(filter, page);
            
            // 阻止事件进一步传播，避免多次触发
            e.preventDefault();
            e.stopPropagation();
        }
    });
    
    // 确保KV分类标签点击可以正确加载对应内容
    document.addEventListener('click', function(e) {
        const kvFilterLi = e.target.closest && e.target.closest('.kv-filter-buttons li');
        if (kvFilterLi) {
            const filter = kvFilterLi.getAttribute('data-filter');
            if (filter && filter.startsWith('.')) {
                const folderName = filter.substring(1); // 移除前面的点
                console.log(`KV分类标签点击: ${folderName}`);
                
                // 更新所有标签状态
                document.querySelectorAll('.kv-filter-buttons li').forEach(li => {
                    li.classList.remove('active');
                });
                kvFilterLi.classList.add('active');
                
                // 重置加载更多按钮
                const loadMoreBtn = document.getElementById('load-more-kv');
                if (loadMoreBtn) {
                    loadMoreBtn.setAttribute('data-page', '1');
                    loadMoreBtn.setAttribute('data-filter', folderName);
                }
                
                // 加载第一页
                window.loadKVImages(folderName, 1);
            }
        }
    });
    
    // 确保摄影分类标签点击可以正确加载对应内容
    document.addEventListener('click', function(e) {
        const photoFilterLi = e.target.closest && e.target.closest('.photography-filter-buttons li');
        if (photoFilterLi) {
            const filter = photoFilterLi.getAttribute('data-filter');
            if (filter) {
                console.log(`摄影分类标签点击: ${filter}`);
                
                // 更新所有标签状态
                document.querySelectorAll('.photography-filter-buttons li').forEach(li => {
                    li.classList.remove('active');
                });
                photoFilterLi.classList.add('active');
                
                // 重置加载更多按钮
                const loadMoreBtn = document.getElementById('load-more-photography');
                if (loadMoreBtn) {
                    loadMoreBtn.setAttribute('data-page', '1');
                    loadMoreBtn.setAttribute('data-filter', filter);
                }
                
                // 加载第一页
                window.loadPhotographyImages(filter, 1);
            }
        }
    });
    
    // 初次加载后检查并初始化按钮状态
    setTimeout(function() {
        // KV按钮初始化
        const kvButton = document.getElementById('load-more-kv');
        if (kvButton && !kvButton.getAttribute('data-filter')) {
            kvButton.setAttribute('data-filter', 'handdrawn');
            kvButton.setAttribute('data-page', '1');
        }
        
        // 摄影按钮初始化
        const photoButton = document.getElementById('load-more-photography');
        if (photoButton && !photoButton.getAttribute('data-filter')) {
            photoButton.setAttribute('data-filter', 'travel');
            photoButton.setAttribute('data-page', '1');
        }
        
        console.log('按钮状态初始化完成，索引已扩展到100');
    }, 1000);
    
    // 记录每个文件夹中已尝试的最大索引
    const folderMaxIndex = {};
    const photographyFolderMaxIndex = {};
    
    // 摄影瀑布流实例
    let $photographyMasonry = null;
    
    // 安全获取DOM元素 - 避免null错误
    const projectFilters = document.querySelectorAll('.project-filter li');
    const projectMasonry = document.querySelector('.project-masonry-active');
    const kvGalleryContainer = document.getElementById('kv-gallery-container');
    const photographyGalleryContainer = document.getElementById('photography-gallery-container');
    
    // 确保元素存在后再处理
    if (projectFilters && projectMasonry) {
        // 为每个过滤器添加点击事件
        projectFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // 如果点击的是KV设计分类
                if (filterValue === '.kv-design' && kvGalleryContainer) {
                    // 显示KV画廊，隐藏项目列表和摄影画廊
                    kvGalleryContainer.classList.remove('d-none');
                    projectMasonry.classList.add('d-none');
                    if(photographyGalleryContainer) photographyGalleryContainer.classList.add('d-none');
                    
                    // 如果首次加载
                    if (!kvGalleryContainer.getAttribute('data-loaded')) {
                        initializeKVCategories()
                            .then(() => {
                                // 获取第一个分类并加载对应图片
                                const firstCategory = Object.keys(folderDisplayNames)[0] || 'handdrawn';
                                
                                // 重要：确保加载更多按钮状态一致
                                const loadMoreBtn = document.getElementById('load-more-kv');
                                if (loadMoreBtn) {
                                    loadMoreBtn.setAttribute('data-current-filter', firstCategory);
                                    loadMoreBtn.setAttribute('data-page', '1');
                                    console.log(`初始化KV加载按钮过滤器: ${firstCategory}`);
                                }
                                
                                // 加载初始图片
                                console.log(`初始加载KV图片，分类=${firstCategory}`);
                                loadKVImages(firstCategory, 1);
                                
                                createLightboxIfNeeded();
                                kvGalleryContainer.setAttribute('data-loaded', 'true');
                            });
                    }
                } 
                // 如果点击的是摄影分类
                else if (filterValue === '.photography' && photographyGalleryContainer) {
                    // 显示摄影画廊，隐藏项目列表和KV画廊
                    photographyGalleryContainer.classList.remove('d-none');
                    projectMasonry.classList.add('d-none');
                    if(kvGalleryContainer) kvGalleryContainer.classList.add('d-none');
                    
                    // 首先确保分类标签已初始化
                    if (!photographyGalleryContainer.getAttribute('data-categories-initialized')) {
                        console.log('初始化摄影分类标签');
                        initializePhotographyCategories()
                            .then(() => {
                                console.log('摄影分类标签初始化完成');
                                photographyGalleryContainer.setAttribute('data-categories-initialized', 'true');
                                
                                // 在标签初始化后等待短暂时间再加载图片
                                setTimeout(() => {
                                    // 获取第一个分类
                                    const firstCategory = Object.keys(photographyFolderDisplayNames)[0] || 'travel';
                                    console.log(`准备加载摄影图片，默认分类=${firstCategory}`);
                                    
                                    // 更新加载按钮状态
                                    const loadMoreBtn = document.getElementById('load-more-photography');
                                    if (loadMoreBtn) {
                                        loadMoreBtn.textContent = '加载中...';
                                        loadMoreBtn.disabled = true;
                                        loadMoreBtn.setAttribute('data-current-filter', firstCategory);
                                        loadMoreBtn.setAttribute('data-page', '1');
                                    }
                                    
                                    // 自动加载第一个分类的图片
                                    loadPhotographyImages(firstCategory, 1);
                                }, 200);
                            });
                    } else {
                        // 分类已初始化，仅加载图片
                        const activeFilter = document.querySelector('.photography-filter-buttons li.active');
                        const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'travel';
                        
                        // 获取当前选择的分类，并加载对应图片
                        console.log(`摄影分类已初始化，加载当前选择分类=${filter}`);
                        
                        // 更新加载按钮状态
                        const loadMoreBtn = document.getElementById('load-more-photography');
                        if (loadMoreBtn) {
                            loadMoreBtn.textContent = '加载中...';
                            loadMoreBtn.disabled = true;
                        }
                        
                        // 加载当前分类的图片
                        loadPhotographyImages(filter, 1);
                    }
                } else {
                    // 隐藏KV画廊和摄影画廊，显示项目列表
                    if(kvGalleryContainer) kvGalleryContainer.classList.add('d-none');
                    if(photographyGalleryContainer) photographyGalleryContainer.classList.add('d-none');
                    projectMasonry.classList.remove('d-none');
                }
            });
        });
    } else {
        console.warn('某些DOM元素未找到，图库可能无法正常工作');
    }
    
    // 初始化KV分类标签 - 修复状态同步问题
    async function initializeKVCategories() {
        try {
            const categories = Object.keys(folderDisplayNames);
            const filterContainer = document.querySelector('.kv-filter-buttons');
            const loadMoreBtn = document.getElementById('load-more-kv');
            
            if (!filterContainer) {
                console.error('找不到KV过滤器容器');
                return false;
            }
            
            // 设置第一个分类为初始分类
            const firstCategory = categories[0] || 'handdrawn';
            
            // 重要：在初始化时立即设置加载更多按钮的当前过滤器
            if (loadMoreBtn) {
                loadMoreBtn.setAttribute('data-current-filter', firstCategory);
                loadMoreBtn.setAttribute('data-page', '1');
                console.log(`初始化：设置KV加载更多按钮的当前过滤器为 ${firstCategory}`);
            }
            
            // 确保已有"全部"选项(隐藏)
            if (!filterContainer.querySelector('[data-filter="all"]')) {
                const allBtn = document.createElement('li');
                allBtn.setAttribute('data-filter', 'all');
                allBtn.textContent = '全部';
                allBtn.style.display = 'none';
                filterContainer.appendChild(allBtn);
            } else {
                // 如果已经存在"全部"按钮，确保它不是活动状态
                const existingAllBtn = filterContainer.querySelector('[data-filter="all"]');
                existingAllBtn.style.display = 'none';
                existingAllBtn.classList.remove('active');
            }
            
            // 添加其他分类按钮
            categories.forEach((category, index) => {
                if (!filterContainer.querySelector(`[data-filter="${category}"]`)) {
                    const btn = document.createElement('li');
                    btn.setAttribute('data-filter', category);
                    btn.textContent = folderDisplayNames[category] || category;
                    
                    // 如果是第一个分类，设置为激活状态
                    if (index === 0) {
                        btn.classList.add('active');
                    }
                    
                    filterContainer.appendChild(btn);
                    
                    // 添加点击事件
                    btn.addEventListener('click', function() {
                        document.querySelectorAll('.kv-filter-buttons li').forEach(li => {
                            li.classList.remove('active');
                        });
                        this.classList.add('active');
                        
                        // 获取过滤器值
                        const filter = this.getAttribute('data-filter');
                        console.log(`点击KV分类标签: ${filter}`);
                        
                        // 重要：更新加载更多按钮的状态
                        if (loadMoreBtn) {
                            loadMoreBtn.setAttribute('data-current-filter', filter);
                            loadMoreBtn.setAttribute('data-page', '1');
                            console.log(`已更新KV加载更多按钮的过滤器为: ${filter}`);
                        }
                        
                        // 加载第一页
                        loadKVImages(filter, 1);
                    });
                }
            });
            
            console.log(`KV分类初始化完成，共 ${categories.length} 个分类，初始分类为 ${firstCategory}`);
            return true;
        } catch (error) {
            console.error('初始化KV分类失败:', error);
            return false;
        }
    }
    
    // 修改 createLightboxIfNeeded 函数，确保正确初始化灯箱
    function createLightboxIfNeeded() {
        // 如果已存在则删除旧的lightbox元素
        const oldLightbox = document.querySelector('.kv-lightbox');
        if (oldLightbox) {
            oldLightbox.remove();
        }
        
        // 创建一个全新的lightbox元素
        const lightboxHtml = `
            <div class="kv-lightbox">
                <div class="kv-lightbox-content">
                    <img src="" alt="大图预览">
                    <div class="kv-lightbox-close">×</div>
                    <div class="kv-lightbox-prev">❮</div>
                    <div class="kv-lightbox-next">❯</div>
                </div>
            </div>
        `;
        
        // 插入DOM
        document.body.insertAdjacentHTML('beforeend', lightboxHtml);
        
        // 获取元素
        const lightbox = document.querySelector('.kv-lightbox');
        const closeBtn = lightbox.querySelector('.kv-lightbox-close');
        const prevBtn = lightbox.querySelector('.kv-lightbox-prev');
        const nextBtn = lightbox.querySelector('.kv-lightbox-next');
        
        // 关闭函数
        function closeLightbox() {
            console.log('关闭Lightbox');
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // 直接添加事件监听器
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeLightbox();
        });
        
        // 导航函数
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('点击上一张按钮');
            navigateInCurrentCategory('prev');
        });
        
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('点击下一张按钮');
            navigateInCurrentCategory('next');
        });
        
        // 点击背景关闭
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target === lightbox.querySelector('.kv-lightbox-content')) {
                closeLightbox();
            }
        });
        
        // 键盘导航
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateInCurrentCategory('prev');
            } else if (e.key === 'ArrowRight') {
                navigateInCurrentCategory('next');
            }
        });
        
        console.log('新的Lightbox已创建并初始化');
    }
    
    // 修改导航函数，使用更可靠的方法获取当前分类和图片
    function navigateInCurrentCategory(direction) {
        console.log('导航方向:', direction);
        
        // 获取当前活动的分类和标签
        let currentCategory = '';
        let currentFilter = '';
        
        // 检查当前哪个分类是可见的
        if (!document.getElementById('kv-gallery-container').classList.contains('d-none')) {
            currentCategory = 'kv';
            const activeFilter = document.querySelector('.kv-filter-buttons li.active');
            currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'handdrawn';
        } 
        else if (!document.getElementById('photography-gallery-container').classList.contains('d-none')) {
            currentCategory = 'photography';
            const activeFilter = document.querySelector('.photography-filter-buttons li.active');
            currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'travel';
        }
        else if (!document.getElementById('packaging-gallery-container').classList.contains('d-none')) {
            currentCategory = 'packaging';
            const activeFilter = document.querySelector('.packaging-filter-buttons li.active');
            currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'food';
        }
        
        console.log(`当前分类: ${currentCategory}, 当前标签: ${currentFilter}`);
        
        if (!currentCategory || !currentFilter) {
            console.error('无法确定当前分类和标签');
            return;
        }
        
        // 获取当前分类下的所有图片项
        let selector = '';
        if (currentCategory === 'kv') {
            selector = '.kv-grid-item';
        } else if (currentCategory === 'photography') {
            selector = '.photography-grid-item';
        } else if (currentCategory === 'packaging') {
            selector = '.packaging-grid-item';
        }
        
        const items = document.querySelectorAll(selector);
        console.log(`找到 ${items.length} 个图片项`);
        
        if (!items || items.length === 0) {
            console.error('当前分类下没有图片项');
            return;
        }
        
        // 获取当前显示的图片索引
        const lightbox = document.querySelector('.kv-lightbox');
        const currentIndex = parseInt(lightbox.getAttribute('data-current-index') || '0');
        
        console.log(`当前索引: ${currentIndex}, 总图片数: ${items.length}`);
        
        // 找到下一个/上一个图片
        let nextIndex = -1;
        
        if (direction === 'next') {
            // 找下一张
            for (let i = 0; i < items.length; i++) {
                const index = parseInt(items[i].getAttribute('data-index') || '0');
                if (index > currentIndex) {
                    nextIndex = index;
                    break;
                }
            }
            
            // 如果没找到下一张，循环到第一张
            if (nextIndex === -1 && items.length > 0) {
                nextIndex = parseInt(items[0].getAttribute('data-index') || '1');
            }
        } else {
            // 找上一张
            for (let i = items.length - 1; i >= 0; i--) {
                const index = parseInt(items[i].getAttribute('data-index') || '0');
                if (index < currentIndex) {
                    nextIndex = index;
                    break;
                }
            }
            
            // 如果没找到上一张，循环到最后一张
            if (nextIndex === -1 && items.length > 0) {
                nextIndex = parseInt(items[items.length - 1].getAttribute('data-index') || '1');
            }
        }
        
        console.log(`下一个索引: ${nextIndex}`);
        
        if (nextIndex !== -1) {
            // 构建图片URL
            let imgUrl;
            let isLongImage = false;
            
            if (currentCategory === 'kv') {
                imgUrl = `https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/kv/${currentFilter}/${currentFilter}kv${nextIndex}.jpg`;
            } else if (currentCategory === 'photography') {
                imgUrl = `https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/photograph/${currentFilter}/${currentFilter}${nextIndex}.jpg`;
            } else if (currentCategory === 'packaging') {
                if (currentFilter === 'food' || currentFilter === 'daily') {
                    imgUrl = `https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/packaging/${currentFilter}/${currentFilter}${nextIndex}_full.jpg`;
                    isLongImage = true;
                } else {
                    imgUrl = `https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/packaging/${currentFilter}/${currentFilter}${nextIndex}.jpg`;
                }
            }
            
            console.log(`导航到: 索引=${nextIndex}, 图片=${imgUrl}`);
            
            // 预加载图片
            const preloadImg = new Image();
            preloadImg.onload = function() {
                // 更新灯箱
                const lightboxImg = lightbox.querySelector('img');
                lightboxImg.src = imgUrl;
                lightbox.setAttribute('data-current-index', nextIndex);
                
                // 为长图添加特殊样式
                if (isLongImage) {
                    lightbox.classList.add('long-image-mode');
                    lightboxImg.classList.add('long-image');
                } else {
                    lightbox.classList.remove('long-image-mode');
                    lightboxImg.classList.remove('long-image');
                }
            };
            
            preloadImg.onerror = function() {
                console.error(`图片加载失败: ${imgUrl}`);
                // 如果图片加载失败，尝试下一张
                lightbox.setAttribute('data-current-index', nextIndex);
                navigateInCurrentCategory(direction);
            };
            
            preloadImg.src = imgUrl;
        }
    }
    
    // 修改 openLightbox 函数
    function openLightbox(imageUrl, index, isLongImage = false) {
        console.log(`打开Lightbox: 图片=${imageUrl}, 索引=${index}, 长图=${isLongImage ? '是' : '否'}`);
        
        // 确保Lightbox已创建
        if (!document.querySelector('.kv-lightbox')) {
            createLightboxIfNeeded();
        }
        
        const lightbox = document.querySelector('.kv-lightbox');
        const lightboxImg = lightbox.querySelector('img');
        
        // 重置图片样式
        lightboxImg.style.opacity = '0';
        
        // 设置图片源
        lightboxImg.src = imageUrl;
        lightbox.setAttribute('data-current-index', index);
        
        // 图片加载完成后显示
        lightboxImg.onload = function() {
            lightboxImg.style.opacity = '1';
        };
        
        // 为长图添加特殊样式
        if (isLongImage) {
            lightbox.classList.add('long-image-mode');
            lightboxImg.classList.add('long-image');
        } else {
            lightbox.classList.remove('long-image-mode');
            lightboxImg.classList.remove('long-image');
        }
        
        // 显示lightbox
        lightbox.classList.add('active');
        
        // 禁止滚动
        document.body.style.overflow = 'hidden';
    }
    
    // 确保初始化摄影分类函数正确创建标签
    function initializePhotographyCategories() {
        return new Promise((resolve) => {
            try {
                console.log('开始初始化摄影分类标签');
                const categories = Object.keys(photographyFolderDisplayNames);
                const filterContainer = document.querySelector('.photography-filter-buttons');
                
                if (!filterContainer) {
                    console.error('找不到摄影过滤器容器');
                    resolve(false);
                    return;
                }
                
                // 清空现有按钮以避免重复
                filterContainer.innerHTML = '';
                
                // 隐藏的"全部"按钮（如需要）
                const allBtn = document.createElement('li');
                allBtn.setAttribute('data-filter', 'all');
                allBtn.textContent = '全部';
                allBtn.style.display = 'none';
                filterContainer.appendChild(allBtn);
                
                // 添加各个分类按钮
                categories.forEach((category, index) => {
                    const btn = document.createElement('li');
                    btn.setAttribute('data-filter', category);
                    btn.textContent = photographyFolderDisplayNames[category] || category;
                    
                    // 第一个分类设为活动状态
                    if (index === 0) {
                        btn.classList.add('active');
                    }
                    
                    filterContainer.appendChild(btn);
                    
                    // 标记已添加事件
                    btn.setAttribute('data-event-bound', 'true');
                });
                
                // 委托事件到父容器而不是每个按钮，避免重复绑定
                if (!filterContainer.getAttribute('data-event-bound')) {
                    filterContainer.setAttribute('data-event-bound', 'true');
                    filterContainer.addEventListener('click', function(e) {
                        const target = e.target.closest('li');
                        if (!target) return;
                        
                        document.querySelectorAll('.photography-filter-buttons li').forEach(li => {
                            li.classList.remove('active');
                        });
                        target.classList.add('active');
                        
                        const filter = target.getAttribute('data-filter');
                        console.log(`点击摄影分类标签: ${filter}`);
                        
                        // 更新加载按钮状态
                        const loadMoreBtn = document.getElementById('load-more-photography');
                        if (loadMoreBtn) {
                            loadMoreBtn.setAttribute('data-current-filter', filter);
                            loadMoreBtn.setAttribute('data-page', '1');
                            loadMoreBtn.textContent = '加载中...';
                            loadMoreBtn.disabled = true;
                        }
                        
                        // 加载图片
                        loadPhotographyImages(filter, 1);
                    });
                }
                
                console.log(`摄影分类标签创建完成: ${categories.join(', ')}`);
                resolve(true);
            } catch (error) {
                console.error('初始化摄影分类标签失败:', error);
                resolve(false);
            }
        });
    }
    
    // 调试云存储状态
    setTimeout(function() {
        console.log('当前云存储状态:', {
            useCloudStorage: typeof useCloudStorage !== 'undefined' ? useCloudStorage : '未定义',
            cloudStorageBaseUrl: typeof cloudStorageBaseUrl !== 'undefined' ? cloudStorageBaseUrl : '未定义'
        });
    }, 1000);
    
    console.log('云存储支持的统一图片加载系统初始化完成');
    
    // 初始化包装设计分类
    function initializePackagingCategories() {
        return new Promise((resolve) => {
            try {
                console.log('开始初始化包装设计分类标签');
                const categories = Object.keys(packagingFolderDisplayNames);
                const filterContainer = document.querySelector('.packaging-filter-buttons');
                
                if (!filterContainer) {
                    console.error('找不到包装设计过滤器容器');
                    resolve(false);
                    return;
                }
                
                console.log('找到包装设计过滤器容器:', filterContainer);
                
                // 清空现有按钮以避免重复
                filterContainer.innerHTML = '';
                
                // 添加各个分类按钮
                categories.forEach((category, index) => {
                    const btn = document.createElement('li');
                    btn.setAttribute('data-filter', category);
                    btn.textContent = packagingFolderDisplayNames[category] || category;
                    
                    // 第一个分类设为活动状态
                    if (index === 0) {
                        btn.classList.add('active');
                    }
                    
                    filterContainer.appendChild(btn);
                    console.log('添加包装设计标签:', category);
                });
                
                // 委托事件到父容器
                filterContainer.addEventListener('click', function(e) {
                    const target = e.target.closest('li');
                    if (!target) return;
                    
                    document.querySelectorAll('.packaging-filter-buttons li').forEach(li => {
                        li.classList.remove('active');
                    });
                    target.classList.add('active');
                    
                    const filter = target.getAttribute('data-filter');
                    console.log(`点击包装设计分类标签: ${filter}`);
                    
                    // 更新加载按钮状态
                    const loadMoreBtn = document.getElementById('load-more-packaging');
                    if (loadMoreBtn) {
                        loadMoreBtn.setAttribute('data-filter', filter);
                        loadMoreBtn.setAttribute('data-page', '1');
                        loadMoreBtn.textContent = '加载更多';
                        loadMoreBtn.disabled = false;
                    }
                    
                    // 加载图片
                    window.loadPackagingImages(filter, 1);
                });
                
                console.log(`包装设计分类标签创建完成: ${categories.join(', ')}`);
                resolve(true);
            } catch (error) {
                console.error('初始化包装设计分类标签失败:', error);
                resolve(false);
            }
        });
    }
    
    // 确保在页面加载完成后立即初始化包装设计分类
    initializePackagingCategories().then(success => {
        if (success) {
            console.log('包装设计分类初始化成功');
            // 加载第一个分类的图片
            const firstCategory = Object.keys(packagingFolderDisplayNames)[0] || 'food';
            
            // 确保加载按钮正确设置
            const loadMoreBtn = document.getElementById('load-more-packaging');
            if (loadMoreBtn) {
                loadMoreBtn.setAttribute('data-filter', firstCategory);
                loadMoreBtn.setAttribute('data-page', '1');
            }
            
            // 加载第一个分类的图片
            window.loadPackagingImages(firstCategory, 1);
        } else {
            console.error('包装设计分类初始化失败');
        }
    });
    
    // 为加载更多按钮添加点击事件
    const loadMorePackagingBtn = document.getElementById('load-more-packaging');
    if (loadMorePackagingBtn) {
        loadMorePackagingBtn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter') || 'food';
            const page = parseInt(this.getAttribute('data-page') || '1') + 1;
            
            console.log(`包装设计加载更多按钮点击: 分类=${filter}, 页码=${page}`);
            this.setAttribute('data-page', page);
            
            window.loadPackagingImages(filter, page);
        });
    }
}); 