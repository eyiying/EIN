document.addEventListener('DOMContentLoaded', function() {
    console.log('执行索引扩展和性能优化');
    
    // 添加智能设计分类最大索引
    window.intelligentFolderMaxIndex = {
        'jieri': 100,
        'hanzi': 100,
        'jixiangwu': 100,
        'tubiao': 100,
        'beijing': 100
    };
    
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
        'nature': 100,
        'cuisine': 100,    // 从'food'改为'cuisine'
    };
    
    // 添加包装设计分类最大索引
    window.packagingFolderMaxIndex = {
        'food': 100,
        'daily': 100,
        'pattern': 100
    };
    
    // 设置活动运营分类最大索引
    window.campaignFolderMaxIndex = {
        'longcontent': 100,
        'poster': 100,
        'popup': 100
    };
    
    // 添加UI设计分类最大索引
    window.uiDesignFolderMaxIndex = {
        'web': 100,
        'app': 100
    };
    
    // 添加字体设计图片数量配置
    window.fontDesignMaxIndex = 30; // 假设字体设计文件夹中有30张图片
    
    // KV设计文件夹映射
    const folderDisplayNames = {
        'handdrawn': '手绘',  
        'aigc': 'AIGC',
        '3d': '3D',
        '2.5d': '2.5D',
        'pingmian': '平面',
        'jianyue': '简约',
    };
    
    // 智能设计分类映射
    const intelligentFolderDisplayNames = {
        'jieri': '节日',
        'hanzi': '字体',
        'jixiangwu': 'IP',
        'tubiao': '图标',
        'beijing': '背景'
    };
    
    // 摄影分类映射
    const photographyFolderDisplayNames = { 
        'portrait': '人像',
        'cuisine': '美食', 
        'travel': '旅行',
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
    
    // 活动运营分类映射
    const campaignFolderDisplayNames = {
        'longcontent': '长图文',
        'poster': '海报',
        'popup': '弹窗'
    };
    
    // UI设计分类映射
    const uiDesignFolderDisplayNames = {
        'app': 'APP|H5',
        'web': 'PC|WEB'
    };
    
    // 两个不同的云存储基础URL
    const kvCloudBaseUrl = 'https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/kv/';
    const photographyCloudBaseUrl = 'https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/photograph/'; // 修正拼写错误，从photogragh改为photograph
    const packagingCloudBaseUrl = 'https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/packaging/'; // 添加包装设计云存储URL
    const campaignCloudBaseUrl = 'https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/campaign/';
    const intelligentCloudBaseUrl = 'https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/intelligent/'; // 添加智能设计云存储URL
    const uiDesignCloudBaseUrl = 'https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/ui-design/'; // 添加UI设计云存储URL
    const fontDesignCloudBaseUrl = 'https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/';
    
    // 仅初始化必要元素，不改变现有布局
    function ensureGridElements(selector) {
        const gridGallery = document.querySelector(selector);
        if (!gridGallery) return;
        
        // 不添加额外的样式或元素，只检查容器是否存在
        console.log(`确认网格容器: ${selector}`);
        return gridGallery;
    }
    
    // 定义一个全局变量来追踪masonry实例
    window.campaignPosterMasonry = null;
    
    // 统一图片加载函数
    window.loadImages = function(options) {
        const config = {
            category: '',        // 'kv' 或 'photography' 或 'packaging' 或 'campaign' 或 'ui-design' 或 'ip-design' 或 'font-design' 或 'intelligent'
            filter: '',          // 文件夹或分类名称
            page: 1,             // 当前页码
            cloudBaseUrl: 'https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/', // 云存储基础URL
            useCloud: true,      // 是否使用云存储
            append: false,       // 新增参数：是否追加内容
            ...options
        };
        
        // 添加防重复加载保护
        const loadingKey = `${config.category}-${config.filter}-${config.page}`;
        if (window.currentlyLoading === loadingKey) {
            console.log(`已在加载: ${loadingKey}, 忽略重复请求`);
            return;
        }
        window.currentlyLoading = loadingKey;
        
        console.log(`加载图片: 分类=${config.category}, 过滤器=${config.filter}, 页码=${config.page}, 使用云=${config.useCloud}, 追加=${config.append}`);
        
        // 获取关键DOM元素
        const gridSelector = config.category === 'kv' ? '.kv-grid-gallery' : 
                            (config.category === 'photography' ? '.photography-grid-gallery' : 
                            (config.category === 'packaging' ? '.packaging-grid-gallery' : 
                            (config.category === 'ui-design' ? '.ui-design-grid-gallery' : 
                            (config.category === 'ip-design' ? '.ip-design-grid-gallery' : 
                            (config.category === 'font-design' ? '.font-design-grid-gallery' : 
                            (config.category === 'intelligent' ? '.intelligent-grid-gallery' : '.campaign-grid-gallery'))))));
        const gridGallery = document.querySelector(gridSelector);
        const buttonId = config.category === 'kv' ? 'load-more-kv' : 
                        (config.category === 'photography' ? 'load-more-photography' : 
                        (config.category === 'packaging' ? 'load-more-packaging' : 
                        (config.category === 'ui-design' ? 'load-more-ui-design' : 
                        (config.category === 'ip-design' ? 'load-more-ip-design' : 
                        (config.category === 'font-design' ? 'load-more-font-design' : 
                        (config.category === 'intelligent' ? 'load-more-intelligent' : 'load-more-campaign'))))));
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
        
        // 关键修改：仅在非追加模式(append=false)且是第一页时清空网格内容
        if (!config.append && config.page === 1) {
            gridGallery.innerHTML = '';
        }
        
        // 计算要加载的图片范围
        const perPage = 12; // 每页图片数
        const startIndex = (config.page - 1) * perPage + 1;
        
        // 获取最大索引
        const maxIndexObj = config.category === 'kv' ? window.kvFolderMaxIndex : 
                           (config.category === 'photography' ? window.photographyFolderMaxIndex : 
                           (config.category === 'packaging' ? window.packagingFolderMaxIndex : 
                           (config.category === 'ui-design' ? window.uiDesignFolderMaxIndex : 
                           (config.category === 'ip-design' ? window.ipDesignMaxIndex : 
                           (config.category === 'font-design' ? window.fontDesignMaxIndex : 
                           (config.category === 'intelligent' ? window.intelligentFolderMaxIndex : window.campaignFolderMaxIndex))))));
        const maxIndex = maxIndexObj && typeof maxIndexObj === 'object' && maxIndexObj[config.filter] ? 
                         maxIndexObj[config.filter] : (typeof maxIndexObj === 'number' ? maxIndexObj : 100); // 默认100
        
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
            window.currentlyLoading = null;
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
                } else if (config.category === 'ip-design') {
                    // IP设计图片路径
                    imgUrl = `${config.cloudBaseUrl}ip-design/ip${i}.jpg`;
                    fullImgUrl = imgUrl; // IP设计没有_full后缀
                } else if (config.category === 'font-design') {
                    // 字体设计图片路径
                    imgUrl = `${config.cloudBaseUrl}font-design/font${i}.jpg`;
                    fullImgUrl = imgUrl; // 字体设计没有_full后缀
                } else if (config.category === 'intelligent') {
                    // 添加智能设计URL构建
                    imgUrl = `${intelligentCloudBaseUrl}${config.filter}/${config.filter}${i}.jpg`;
                    console.log('尝试加载智能设计图片:', imgUrl);
                    fullImgUrl = imgUrl; // 智能设计没有_full后缀
                } else if (config.category === 'campaign') {
                    // 确保路径格式正确 - 检查是否需要额外的斜杠
                    imgUrl = `${config.cloudBaseUrl}${config.filter}/${config.filter}${i}.jpg`;
                    console.log('尝试加载图片:', imgUrl);
                    fullImgUrl = imgUrl;
                } else if (config.category === 'ui-design') {
                    // UI设计图片路径
                    imgUrl = `${config.cloudBaseUrl}${config.filter}/${config.filter}${i}.jpg`;
                    console.log('尝试加载UI设计图片:', imgUrl);
                    fullImgUrl = imgUrl;
                }
            } else {
                // 本地路径
                if (config.category === 'ip-design') {
                    imgUrl = `assets/images/ip-design/ip${i}.jpg`;
                } else if (config.category === 'font-design') {
                    imgUrl = `assets/images/font-design/font${i}.jpg`;
                } else {
                    imgUrl = `assets/images/${config.category}/${config.filter}/${i}.jpg`;
                }
                
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
                                    (config.category === 'photography' ? 'photography-grid-item' : 
                                    (config.category === 'packaging' ? 'packaging-grid-item' : 
                                    (config.category === 'ui-design' ? 'ui-design-grid-item' : 
                                    (config.category === 'ip-design' ? 'ip-design-grid-item' : 
                                    (config.category === 'font-design' ? 'font-design-grid-item' : 
                                    (config.category === 'intelligent' ? 'intelligent-grid-item' : 'campaign-grid-item'))))));
                gridItem.setAttribute('data-index', startIndex + index);
                
                // 在这里添加长图文特殊类
                if (config.category === 'campaign' && config.filter === 'longcontent') {
                    gridItem.classList.add('longcontent-item');
                }
                
                // 为海报项添加特殊类
                if (config.category === 'campaign' && config.filter === 'poster') {
                    gridItem.classList.add('poster-item');
                    
                    // 检测图片比例，添加相应的类
                    const img = result.element;
                    const ratio = img.naturalHeight / img.naturalWidth;
                    
                    if (ratio < 0.8) {
                        gridItem.classList.add('poster-horizontal'); // 横版海报
                    } else if (ratio > 1.2) {
                        gridItem.classList.add('poster-vertical');  // 竖版海报
                    } else {
                        gridItem.classList.add('poster-square');    // 接近正方形的海报
                    }
                }
                
                // 创建内容容器
                const itemContent = document.createElement('div');
                itemContent.className = config.category === 'kv' ? 'kv-grid-item-content' : 
                                       (config.category === 'photography' ? 'photography-grid-item-content' : 
                                       (config.category === 'packaging' ? 'packaging-grid-item-content' : 
                                       (config.category === 'ui-design' ? 'ui-design-grid-item-content' : 
                                       (config.category === 'ip-design' ? 'ip-design-grid-item-content' : 
                                       (config.category === 'font-design' ? 'font-design-grid-item-content' : 
                                       (config.category === 'intelligent' ? 'intelligent-grid-item-content' : 'campaign-grid-item-content'))))));
                
                // 创建图片元素
                const imgElement = document.createElement('img');
                imgElement.src = result.url;
                imgElement.alt = `${config.filter} ${startIndex + index}`;
                
                // 针对智能设计添加额外的加载事件监听
                if (config.category === 'intelligent') {
                    imgElement.onload = function() {
                        // 图片加载完成后，更新Masonry布局
                        if (window.intelligentMasonry) {
                            // 延迟一点时间执行布局更新，确保图片完全渲染
                            setTimeout(function() {
                                window.intelligentMasonry.layout();
                                console.log('智能设计图片加载完成，Masonry布局已更新');
                            }, 100);
                        } else {
                            // 如果没有Masonry实例，触发窗口调整事件
                            window.dispatchEvent(new Event('resize'));
                        }
                    };

                    // 为智能设计图片添加错误处理
                    imgElement.onerror = function() {
                        console.error('智能设计图片加载失败:', result.url);
                        // 移除加载失败的项
                        gridItem.style.display = 'none';
                        if (window.intelligentMasonry) {
                            setTimeout(function() {
                                window.intelligentMasonry.layout();
                            }, 100);
                        }
                    };
                }
                
                // 组装DOM结构
                itemContent.appendChild(imgElement);
                gridItem.appendChild(itemContent);
                fragment.appendChild(gridItem);
                
                // 在这里修改点击事件
                gridItem.addEventListener('click', function() {
                    // 原有的灯箱打开代码
                    if (config.category === 'packaging' && (config.filter === 'food' || config.filter === 'daily')) {
                        openLightbox(result.fullUrl, startIndex + index, true, config.category, config.filter);
                    } else if (config.category === 'ip-design') {
                        // IP设计使用普通灯箱模式
                        openLightbox(result.url, startIndex + index, false, config.category, config.filter);
                    } else if (config.category === 'font-design') {
                        // 字体设计使用普通灯箱模式
                        openLightbox(result.url, startIndex + index, false, config.category, config.filter);
                    } else {
                        // 为长图文添加特殊处理
                        if (config.category === 'campaign' && config.filter === 'longcontent') {
                            openLightbox(result.url, startIndex + index, false, config.category, config.filter);
                            
                            // 为长图文添加特殊类
                            const lightbox = document.querySelector('.kv-lightbox');
                            if (lightbox) {
                                lightbox.classList.add('longcontent-mode');
                            }
                        } else {
                            openLightbox(result.url, startIndex + index, false, config.category, config.filter);
                        }
                    }
                });
            });
            
            // 将所有网格项一次性添加到文档中
            gridGallery.appendChild(fragment);
            
            // 针对智能设计特殊处理
            if (config.category === 'intelligent' && window.intelligentMasonry) {
                // 在添加新项后重新布局
                setTimeout(function() {
                    window.intelligentMasonry.reloadItems();
                    window.intelligentMasonry.layout();
                    console.log('智能设计新项已添加，Masonry布局已更新');
                }, 200);
            }
            
            // 启用加载更多按钮并恢复文本
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
            
            // 如果是海报分类，初始化或刷新Masonry布局
            if (config.category === 'campaign' && config.filter === 'poster') {
                // 使用setTimeout确保DOM更新后再初始化
                setTimeout(function() {
                    const container = document.querySelector('.campaign-grid-gallery.poster-layout');
                    
                    if (!container) return;
                    
                    // 等待所有图片加载完成
                    const images = container.querySelectorAll('img');
                    let loadedCount = 0;
                    const totalImages = images.length;
                    
                    console.log('等待图片加载完成，总数:', totalImages);
                    
                    // 首先标记所有已加载的图片
                    images.forEach(img => {
                        if (img.complete) {
                            loadedCount++;
                        } else {
                            img.onload = function() {
                                loadedCount++;
                                if (loadedCount === totalImages) {
                                    initOrUpdateMasonry(container, config.page);
                                }
                            };
                            
                            img.onerror = function() {
                                loadedCount++;
                                if (loadedCount === totalImages) {
                                    initOrUpdateMasonry(container, config.page);
                                }
                            };
                        }
                    });
                    
                    // 如果所有图片已加载或没有图片，立即初始化
                    if (loadedCount === totalImages || totalImages === 0) {
                        initOrUpdateMasonry(container, config.page);
                    }
                }, 100);
            }
            
            // 清除加载状态
            window.currentlyLoading = null;
            
            // 重要：在图片加载完成后设置灯箱监听器
            setupLightboxImageListeners();
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
        
        if (e.target && e.target.id === 'load-more-ip-design') {
            const btn = e.target;
            const page = parseInt(btn.getAttribute('data-page') || '1') + 1;
            
            console.log(`IP设计加载更多按钮点击: 页码=${page}`);
            window.loadIPDesignImages(page);
            
            // 阻止事件进一步传播，避免多次触发
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (e.target && e.target.id === 'load-more-font-design') {
            const btn = e.target;
            const page = parseInt(btn.getAttribute('data-page') || '1') + 1;
            
            console.log(`字体设计加载更多按钮点击: 页码=${page}`);
            window.loadFontDesignImages(page);
            
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
                
                // 图片加载后确保创建灯箱
                setTimeout(function() {
                    createLightboxIfNeeded();
                    setupLightboxImageListeners();
                }, 500);
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
                
                // 图片加载后确保创建灯箱
                setTimeout(function() {
                    createLightboxIfNeeded();
                    setupLightboxImageListeners();
                }, 500);
            }
        }
    });
    
    // 确保包装设计分类标签点击可以正确加载对应内容
    document.addEventListener('click', function(e) {
        const packagingFilterLi = e.target.closest && e.target.closest('.packaging-filter-buttons li');
        if (packagingFilterLi) {
            const filter = packagingFilterLi.getAttribute('data-filter');
            if (filter) {
                console.log(`包装设计分类标签点击: ${filter}`);
                
                // 更新所有标签状态
                document.querySelectorAll('.packaging-filter-buttons li').forEach(li => {
                    li.classList.remove('active');
                });
                packagingFilterLi.classList.add('active');
                
                // 重置加载更多按钮
                const loadMoreBtn = document.getElementById('load-more-packaging');
                if (loadMoreBtn) {
                    loadMoreBtn.setAttribute('data-filter', filter);
                    loadMoreBtn.setAttribute('data-page', '1');
                }
                
                // 加载第一页
                window.loadPackagingImages(filter, 1);
                
                // 图片加载后确保创建灯箱
                setTimeout(function() {
                    createLightboxIfNeeded();
                    setupLightboxImageListeners();
                }, 500);
            }
        }
    });
    
    // 确保活动运营分类标签点击可以正确加载对应内容
    document.addEventListener('click', function(e) {
        const campaignFilterLi = e.target.closest && e.target.closest('.campaign-filter-buttons li');
        if (campaignFilterLi) {
            const filter = campaignFilterLi.getAttribute('data-filter');
            if (filter) {
                console.log(`活动运营分类标签点击: ${filter}`);
                
                // 更新所有标签状态
                document.querySelectorAll('.campaign-filter-buttons li').forEach(li => {
                    li.classList.remove('active');
                });
                campaignFilterLi.classList.add('active');
                
                // 重置加载更多按钮
                const loadMoreBtn = document.getElementById('load-more-campaign');
                if (loadMoreBtn) {
                    loadMoreBtn.setAttribute('data-filter', filter);
                    loadMoreBtn.setAttribute('data-page', '1');
                }
                
                // 加载第一页
                window.loadCampaignImages(filter, 1);
                
                // 图片加载后确保创建灯箱
                setTimeout(function() {
                    createLightboxIfNeeded();
                    setupLightboxImageListeners();
                }, 500);
            }
        }
        
        // UI设计分类标签点击事件
        const uiDesignFilterLi = e.target.closest && e.target.closest('.ui-design-filter-buttons li');
        if (uiDesignFilterLi) {
            const filter = uiDesignFilterLi.getAttribute('data-filter');
            if (filter) {
                console.log(`UI设计分类标签点击: ${filter}`);
                
                // 更新所有标签状态
                document.querySelectorAll('.ui-design-filter-buttons li').forEach(li => {
                    li.classList.remove('active');
                });
                uiDesignFilterLi.classList.add('active');
                
                // 重置加载更多按钮
                const loadMoreBtn = document.getElementById('load-more-ui-design');
                if (loadMoreBtn) {
                    loadMoreBtn.setAttribute('data-filter', filter);
                    loadMoreBtn.setAttribute('data-page', '1');
                }
                
                // 加载第一页
                window.loadUIDesignImages(filter, 1);
                
                // 图片加载后确保创建灯箱
                setTimeout(function() {
                    createLightboxIfNeeded();
                    setupLightboxImageListeners();
                }, 500);
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
        
        // UI设计按钮初始化
        const uiDesignButton = document.getElementById('load-more-ui-design');
        if (uiDesignButton && !uiDesignButton.getAttribute('data-filter')) {
            uiDesignButton.setAttribute('data-filter', 'web');
            uiDesignButton.setAttribute('data-page', '1');
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
    const packagingGalleryContainer = document.getElementById('packaging-gallery-container');
    const campaignGalleryContainer = document.getElementById('campaign-gallery-container');
    const uiDesignGalleryContainer = document.getElementById('ui-design-gallery-container');
    
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
                    if(packagingGalleryContainer) packagingGalleryContainer.classList.add('d-none');
                    if(campaignGalleryContainer) campaignGalleryContainer.classList.add('d-none');
                    if(uiDesignGalleryContainer) uiDesignGalleryContainer.classList.add('d-none');
                    
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
                    if(packagingGalleryContainer) packagingGalleryContainer.classList.add('d-none');
                    if(campaignGalleryContainer) campaignGalleryContainer.classList.add('d-none');
                    if(uiDesignGalleryContainer) uiDesignGalleryContainer.classList.add('d-none');
                    
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
                }
                // 如果点击的是UI设计分类
                else if (filterValue === '.ui-design' && uiDesignGalleryContainer) {
                    // 显示UI设计画廊，隐藏其他画廊
                    uiDesignGalleryContainer.classList.remove('d-none');
                    projectMasonry.classList.add('d-none');
                    if(kvGalleryContainer) kvGalleryContainer.classList.add('d-none');
                    if(photographyGalleryContainer) photographyGalleryContainer.classList.add('d-none');
                    if(packagingGalleryContainer) packagingGalleryContainer.classList.add('d-none');
                    if(campaignGalleryContainer) campaignGalleryContainer.classList.add('d-none');
                    
                    // 首先确保分类标签已初始化
                    if (!uiDesignGalleryContainer.getAttribute('data-categories-initialized')) {
                        console.log('初始化UI设计分类标签');
                        initializeUIDesignCategories()
                            .then(() => {
                                console.log('UI设计分类标签初始化完成');
                                uiDesignGalleryContainer.setAttribute('data-categories-initialized', 'true');
                                
                                // 获取第一个分类
                                const firstCategory = Object.keys(uiDesignFolderDisplayNames)[0] || 'web';
                                console.log(`准备加载UI设计图片，默认分类=${firstCategory}`);
                                
                                // 更新加载按钮状态
                                const loadMoreBtn = document.getElementById('load-more-ui-design');
                                if (loadMoreBtn) {
                                    loadMoreBtn.textContent = '加载中...';
                                    loadMoreBtn.disabled = true;
                                    loadMoreBtn.setAttribute('data-current-filter', firstCategory);
                                    loadMoreBtn.setAttribute('data-page', '1');
                                }
                                
                                // 自动加载第一个分类的图片
                                window.loadUIDesignImages(firstCategory, 1);
                            });
                    } else {
                        // 分类已初始化，仅加载图片
                        const activeFilter = document.querySelector('.ui-design-filter-buttons li.active');
                        const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'web';
                        
                        // 获取当前选择的分类，并加载对应图片
                        console.log(`UI设计分类已初始化，加载当前选择分类=${filter}`);
                        
                        // 更新加载按钮状态
                        const loadMoreBtn = document.getElementById('load-more-ui-design');
                        if (loadMoreBtn) {
                            loadMoreBtn.textContent = '加载中...';
                            loadMoreBtn.disabled = true;
                        }
                        
                        // 加载当前分类的图片
                        window.loadUIDesignImages(filter, 1);
                    }
                }
                else {
                    // 隐藏KV画廊和摄影画廊，显示项目列表
                    if(kvGalleryContainer) kvGalleryContainer.classList.add('d-none');
                    if(photographyGalleryContainer) photographyGalleryContainer.classList.add('d-none');
                    if(packagingGalleryContainer) packagingGalleryContainer.classList.add('d-none');
                    if(campaignGalleryContainer) campaignGalleryContainer.classList.add('d-none');
                    if(uiDesignGalleryContainer) uiDesignGalleryContainer.classList.add('d-none');
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
            
            // 确保在加载完成后设置灯箱事件监听器
            setupLightboxImageListeners();
            
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
        const lightbox = document.querySelector('.kv-lightbox');
        
        // 优先从灯箱元素上获取分类和过滤器信息
        let currentCategory = lightbox.getAttribute('data-category');
        let currentFilter = lightbox.getAttribute('data-filter');
        
        // 如果灯箱上没有保存这些信息，则尝试从DOM检测
        if (!currentCategory || !currentFilter) {
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
            else if (!document.getElementById('campaign-gallery-container').classList.contains('d-none')) {
                currentCategory = 'campaign';
                const activeFilter = document.querySelector('.campaign-filter-buttons li.active');
                currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'longcontent';
            }
            else if (!document.getElementById('ui-design-gallery-container').classList.contains('d-none')) {
                currentCategory = 'ui-design';
                const activeFilter = document.querySelector('.ui-design-filter-buttons li.active');
                currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'web';
            }
            else if (!document.getElementById('ip-design-gallery-container').classList.contains('d-none')) {
                currentCategory = 'ip-design';
                currentFilter = 'ip'; // IP设计只有一个固定分类
            }
            else if (!document.getElementById('font-design-gallery-container').classList.contains('d-none')) {
                currentCategory = 'font-design';
                currentFilter = 'font'; // 字体设计只有一个固定分类
            }
            else if (!document.getElementById('intelligent-gallery-container').classList.contains('d-none')) {
                currentCategory = 'intelligent';
                const activeFilter = document.querySelector('.intelligent-filter-buttons li.active');
                currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'jieri';
            }
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
        } else if (currentCategory === 'campaign') {
            selector = '.campaign-grid-item';
        } else if (currentCategory === 'ui-design') {
            selector = '.ui-design-grid-item';
        } else if (currentCategory === 'ip-design') {
            selector = '.ip-design-grid-item';
        } else if (currentCategory === 'font-design') {
            selector = '.font-design-grid-item';
        } else if (currentCategory === 'intelligent') {
            selector = '.intelligent-grid-item';
        }
        
        const items = document.querySelectorAll(selector);
        console.log(`找到 ${items.length} 个图片项`);
        
        if (!items || items.length === 0) {
            console.error('当前分类下没有图片项');
            return;
        }
        
        // 获取当前显示的图片索引
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
            } else if (currentCategory === 'campaign') {
                imgUrl = `https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/campaign/${currentFilter}/${currentFilter}${nextIndex}.jpg`;
                isLongImage = true;
            } else if (currentCategory === 'ui-design') {
                imgUrl = `https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/ui-design/${currentFilter}/${currentFilter}${nextIndex}.jpg`;
                isLongImage = true; // UI设计的所有图片都视为长图
            } else if (currentCategory === 'ip-design') {
                imgUrl = `https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/ip-design/ip${nextIndex}.jpg`;
                isLongImage = false; // IP设计使用普通模式，不是长图
            } else if (currentCategory === 'font-design') {
                imgUrl = `https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/font-design/font${nextIndex}.jpg`;
                isLongImage = false; // 字体设计使用普通模式，不是长图
            } else if (currentCategory === 'intelligent') {
                imgUrl = `https://eindesign-1256127475.cos.ap-shanghai.myqcloud.com/intelligent/${currentFilter}/${currentFilter}${nextIndex}.jpg`;
                isLongImage = false; // 智能设计使用普通模式，不是长图
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
    
    // 修改openLightbox函数，确保每次都绑定导航事件
    function openLightbox(imageUrl, index, hasFullImage, category, filter) {
        console.log('打开灯箱', imageUrl, category, filter);
        
        // 获取灯箱元素
        const lightbox = document.querySelector('.kv-lightbox');
        if (!lightbox) return;
        
        // 获取灯箱图片元素
        const lightboxImg = lightbox.querySelector('img');
        if (!lightboxImg) return;
        
        // 清除所有可能的灯箱模式类
        lightbox.classList.remove('longcontent-mode');
        lightbox.classList.remove('long-image-mode');
        lightbox.classList.remove('packaging-food');  // 清除食品包装标记
        lightbox.classList.remove('packaging-daily'); // 清除日用品包装标记
        lightboxImg.classList.remove('long-image');
        
        // 设置图片源
        lightboxImg.src = imageUrl;
        
        // 重要：设置当前索引和分类信息
        lightbox.setAttribute('data-current-index', index);
        lightbox.setAttribute('data-category', category || '');
        lightbox.setAttribute('data-filter', filter || '');
        
        // 显示灯箱
        lightbox.classList.add('active');
        
        // 根据分类和过滤器添加特定的类
        if (category === 'campaign' && filter === 'longcontent') {
            lightbox.classList.add('longcontent-mode');
            lightboxImg.classList.add('long-image');
        } 
        else if (category === 'ui-design') {
            // 为所有UI设计项目添加长图文灯箱模式
            lightbox.classList.add('ui-longcontent-mode');
            lightboxImg.classList.add('long-image');
        }
        else if (category === 'packaging') {
            if (filter === 'food') {
                lightbox.classList.add('long-image-mode');
                lightbox.classList.add('packaging-food');  // 食品包装特定标记
                lightboxImg.classList.add('long-image');
            } 
            else if (filter === 'daily') {
                lightbox.classList.add('long-image-mode');
                lightbox.classList.add('packaging-daily'); // 日用品包装特定标记
                lightboxImg.classList.add('long-image');
            }
        }
        
        // 重要：重新计算和调整灯箱内容的大小
        adjustLightboxSize();
        
        // 重要：获取并重新绑定导航按钮事件
        const prevButton = document.querySelector('.kv-lightbox-prev');
        const nextButton = document.querySelector('.kv-lightbox-next');
        
        // 移除旧的事件监听器，防止重复绑定
        if (prevButton) {
            const newPrevButton = prevButton.cloneNode(true);
            prevButton.parentNode.replaceChild(newPrevButton, prevButton);
            newPrevButton.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('点击上一张按钮');
                navigateInCurrentCategory('prev');
            });
        }
        
        if (nextButton) {
            const newNextButton = nextButton.cloneNode(true);
            nextButton.parentNode.replaceChild(newNextButton, nextButton);
            newNextButton.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('点击下一张按钮');
                navigateInCurrentCategory('next');
            });
        }
    }
    
    // 优化调整灯箱大小的函数，恢复长图文的滚动浏览体验
    function adjustLightboxSize() {
        const lightbox = document.querySelector('.kv-lightbox');
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        const content = lightbox.querySelector('.kv-lightbox-content');
        const img = lightbox.querySelector('img');
        if (!content || !img) return;
        
        // 重置内容尺寸以确保正确计算
        content.style.width = '';
        content.style.height = '';
        content.style.maxWidth = '';
        content.style.maxHeight = '';
        img.style.maxWidth = '';
        img.style.maxHeight = '';
        img.style.width = '';
        img.style.height = '';
        
        // 根据当前窗口大小和图片类型调整内容区域
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // 判断是否为长图模式
        const isLongImageMode = lightbox.classList.contains('longcontent-mode') || 
                               lightbox.classList.contains('long-image-mode') ||
                               lightbox.classList.contains('ui-longcontent-mode');
        
        // 判断是否为UI设计模式或活动运营长图文模式
        const isUIDesignMode = lightbox.classList.contains('ui-longcontent-mode');
        const isLongContentMode = lightbox.classList.contains('longcontent-mode'); // 添加活动运营长图检测
        
        // 基于当前模式应用不同样式
        if (isUIDesignMode || isLongContentMode) { // 修改判断条件，UI设计和活动运营长图文使用相同样式
            // UI设计模式/活动运营长图模式 - 宽度适中，支持滚动
            content.style.maxHeight = '90vh';
            content.style.overflowY = 'scroll';
            content.style.alignItems = 'flex-start';
            content.style.width = '45%'; // 缩小到45%的宽度
            content.style.maxWidth = '600px'; // 最大宽度600px
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.maxWidth = '100%';
            img.style.maxHeight = 'none';
            
            // 强制应用样式确保滚动功能正常
            setTimeout(() => {
                content.style.overflowY = 'scroll';
                img.style.maxHeight = 'none';
                content.style.width = '45%'; // 再次确保宽度设置成功
                content.style.maxWidth = '600px';
            }, 100);
            
            const modeText = isUIDesignMode ? 'UI设计滚动模式' : '活动运营长图模式';
            console.log(`应用${modeText}，宽度45%，最大宽度600px`);
        } else if (isLongImageMode) {
            // 长图模式 - 启用滚动
            content.style.maxHeight = '90vh';
            content.style.overflowY = 'auto';
            content.style.alignItems = 'flex-start';
            content.style.width = '45%'; // 也应用45%的宽度限制
            content.style.maxWidth = '600px'; // 最大宽度600px
            img.style.maxWidth = '100%';
            img.style.maxHeight = 'none';
            
            console.log('应用长图滚动模式，宽度45%，最大宽度600px');
        } else {
            // 普通图片模式 - 完全适应窗口
            content.style.maxHeight = '80vh';
            content.style.maxWidth = '80vw';
            content.style.alignItems = 'center';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '80vh';
            content.style.overflowY = 'hidden';
            
            console.log('应用普通图片模式');
        }
        
        console.log(`灯箱大小已调整: ${content.style.width}x${content.style.height}, 模式: ${isLongImageMode ? '长图' : '普通'}`);
    }
    
    // 在DOMContentLoaded事件中添加灯箱关闭功能
    function setupLightboxClose() {
        const closeBtn = document.querySelector('.kv-lightbox-close');
        const lightbox = document.querySelector('.kv-lightbox');
        
        if (closeBtn && lightbox) {
            // 使用addEventListener而不是替换元素
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('关闭灯箱');
                lightbox.classList.remove('active');
                lightbox.classList.remove('longcontent-mode');
                
                const lightboxImg = lightbox.querySelector('img');
                if (lightboxImg) {
                    lightboxImg.classList.remove('long-image');
                }
            });
            
            // 点击背景关闭
            lightbox.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                    this.classList.remove('longcontent-mode');
                    
                    const lightboxImg = this.querySelector('img');
                    if (lightboxImg) {
                        lightboxImg.classList.remove('long-image');
                    }
                }
            });
            
            console.log('灯箱关闭事件设置完成');
        } else {
            console.warn('找不到灯箱或关闭按钮元素');
        }
    }
    
    // 调用设置函数
    setupLightboxClose();
    
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
                
                // 在加载完成后添加
                setupLightboxImageListeners();
                
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
                
                // 在加载完成后添加
                setupLightboxImageListeners();
                
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
    
    // 初始化活动运营分类
    function initializeCampaignCategories() {
        return new Promise((resolve) => {
            try {
                console.log('开始初始化活动运营分类标签');
                const categories = Object.keys(campaignFolderDisplayNames);
                const filterContainer = document.querySelector('.campaign-filter-buttons');
                
                if (!filterContainer) {
                    console.error('找不到活动运营过滤器容器');
                    resolve(false);
                    return;
                }
                
                // 清空现有按钮以避免重复
                filterContainer.innerHTML = '';
                
                // 添加各个分类按钮
                categories.forEach((category, index) => {
                    const btn = document.createElement('li');
                    btn.setAttribute('data-filter', category);
                    btn.textContent = campaignFolderDisplayNames[category] || category;
                    
                    // 第一个分类设为活动状态
                    if (index === 0) {
                        btn.classList.add('active');
                    }
                    
                    filterContainer.appendChild(btn);
                });
                
                // 委托事件到父容器
                filterContainer.addEventListener('click', function(e) {
                    const target = e.target.closest('li');
                    if (!target) return;
                    
                    document.querySelectorAll('.campaign-filter-buttons li').forEach(li => {
                        li.classList.remove('active');
                    });
                    target.classList.add('active');
                    
                    const filter = target.getAttribute('data-filter');
                    console.log(`点击活动运营分类标签: ${filter}`);
                    
                    // 根据选择的类别应用特殊布局
                    const gridGallery = document.querySelector('.campaign-grid-gallery');
                    if (filter === 'poster') {
                        gridGallery.classList.add('poster-layout');
                        // 清空现有内容
                        gridGallery.innerHTML = '';
                    } else {
                        gridGallery.classList.remove('poster-layout');
                    }
                    
                    // 更新加载按钮状态
                    const loadMoreBtn = document.getElementById('load-more-campaign');
                    if (loadMoreBtn) {
                        loadMoreBtn.setAttribute('data-filter', filter);
                        loadMoreBtn.setAttribute('data-page', '1');
                        loadMoreBtn.textContent = '加载更多';
                        loadMoreBtn.disabled = false;
                    }
                    
                    // 加载图片
                    window.loadCampaignImages(filter, 1);
                });
                
                console.log(`活动运营分类标签创建完成: ${categories.join(', ')}`);
                
                // 在加载完成后添加
                setupLightboxImageListeners();
                
                resolve(true);
            } catch (error) {
                console.error('初始化活动运营分类标签失败:', error);
                resolve(false);
            }
        });
    }
    
    // 确保在页面加载完成后立即初始化活动运营分类
    initializeCampaignCategories().then(success => {
        if (success) {
            console.log('活动运营分类初始化成功');
            // 加载第一个分类的图片
            const firstCategory = Object.keys(campaignFolderDisplayNames)[0] || 'longcontent';
            
            // 确保加载按钮正确设置
            const loadMoreBtn = document.getElementById('load-more-campaign');
            if (loadMoreBtn) {
                loadMoreBtn.setAttribute('data-filter', firstCategory);
                loadMoreBtn.setAttribute('data-page', '1');
            }
            
            // 加载第一个分类的图片
            window.loadCampaignImages(firstCategory, 1);
        } else {
            console.error('活动运营分类初始化失败');
        }
    });
    
    // 为加载更多按钮添加点击事件
    const loadMoreCampaignBtn = document.getElementById('load-more-campaign');
    if (loadMoreCampaignBtn) {
        loadMoreCampaignBtn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter') || 'longcontent';
            const page = parseInt(this.getAttribute('data-page') || '1') + 1;
            
            console.log(`活动运营加载更多按钮点击: 分类=${filter}, 页码=${page}`);
            this.setAttribute('data-page', page);
            
            window.loadCampaignImages(filter, page);
        });
    }
    
    // 加载活动运营图片函数
    window.loadCampaignImages = function(filter, page) {
        console.log('尝试加载活动运营图片:', filter, page);
        
        // 获取网格容器
        const gridGallery = document.querySelector('.campaign-grid-gallery');
        if (!gridGallery) return;
        
        // 仅在切换分类（page=1）时重置布局
        if (page === 1) {
            console.log('首次加载，重置布局');
            // 完全清空容器内容
            gridGallery.innerHTML = '';
            
            // 重置网格容器样式
            gridGallery.style = '';
            
            // 销毁之前的masonry实例
            if (window.campaignPosterMasonry) {
                if (typeof window.campaignPosterMasonry.destroy === 'function') {
                    window.campaignPosterMasonry.destroy();
                }
                window.campaignPosterMasonry = null;
            }
            
            // 根据过滤器设置布局类
            if (filter === 'poster') {
                gridGallery.classList.add('poster-layout');
            } else {
                gridGallery.classList.remove('poster-layout');
            }
        } else {
            console.log('加载更多，保留已有内容');
            // 加载更多时，不清空容器，不重置布局
        }
        
        // 加载图片
        window.loadImages({
            category: 'campaign',
            filter: filter,
            page: page,
            cloudBaseUrl: campaignCloudBaseUrl,
            append: page > 1 // 关键参数：当page>1时追加内容而不是替换
        });
        
        // 在图片加载后初始化或更新Masonry
        if (filter === 'poster') {
            setTimeout(function() {
                if (page === 1) {
                    // 首次加载，创建新实例
                    if (!window.campaignPosterMasonry) {
                        window.campaignPosterMasonry = new Masonry(gridGallery, {
                            itemSelector: '.campaign-grid-item',
                            percentPosition: true,
                            transitionDuration: 0
                        });
                        console.log('Masonry布局已初始化');
                    }
                } else {
                    // 加载更多，更新现有实例
                    if (window.campaignPosterMasonry) {
                        window.campaignPosterMasonry.reloadItems();
                        window.campaignPosterMasonry.layout();
                        console.log('Masonry布局已更新');
                    }
                }
            }, 500);
        }
    };

    // 在加载包装设计图片的地方添加以下代码，检测并标记长图文
    function markLongImages() {
        // 找到所有包装设计网格项
        const packagingItems = document.querySelectorAll('.packaging-grid-item');
        
        packagingItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                // 检查图片是否已加载
                if (img.complete) {
                    checkAndMarkLongImage(img, item);
                } else {
                    // 如果图片未加载，添加加载事件
                    img.onload = function() {
                        checkAndMarkLongImage(img, item);
                    };
                }
            }
        });
    }

    // 检查并标记长图文
    function checkAndMarkLongImage(img, item) {
        // 高宽比大于1.5的认为是长图
        if (img.naturalHeight / img.naturalWidth > 1.5) {
            item.classList.add('long-image-item');
        }
    }

    // 在图片加载完成后调用
    setTimeout(markLongImages, 500);

    // 初始化或更新Masonry布局的函数
    function initOrUpdateMasonry(container, page) {
        console.log('初始化或更新Masonry布局，页码:', page);
        
        if (typeof Masonry === 'undefined') {
            console.error('Masonry库未加载！');
            return;
        }
        
        // 第一页时创建新的Masonry实例
        if (page === 1) {
            window.campaignPosterMasonry = new Masonry(container, {
                itemSelector: '.campaign-grid-item',
                columnWidth: '.campaign-grid-item',
                percentPosition: true,
                transitionDuration: 0 // 禁用动画可以减少闪烁
            });
            console.log('Masonry实例已创建');
        } else {
            // 加载更多时重新布局
            if (window.campaignPosterMasonry) {
                window.campaignPosterMasonry.reloadItems();
                window.campaignPosterMasonry.layout();
                console.log('Masonry布局已更新');
            } else {
                // 如果实例不存在，创建新实例
                window.campaignPosterMasonry = new Masonry(container, {
                    itemSelector: '.campaign-grid-item',
                    columnWidth: '.campaign-grid-item',
                    percentPosition: true,
                    transitionDuration: 0
                });
                console.log('Masonry实例已创建（加载更多时）');
            }
        }
    }

    // 确保文档加载完成后检查是否需要初始化Masonry
    document.addEventListener('DOMContentLoaded', function() {
        // 检查是否有海报布局需要初始化
        const posterLayout = document.querySelector('.campaign-grid-gallery.poster-layout');
        if (posterLayout) {
            // 等待一段时间确保图片加载
            setTimeout(function() {
                initOrUpdateMasonry(posterLayout, 1);
            }, 500);
        }
    });

    // 添加窗口大小改变事件监听器
    window.addEventListener('resize', adjustLightboxSize);

    // 在图片加载完成后调整灯箱大小
    function setupLightboxImageListeners() {
        // 获取所有图片项
        const kvItems = document.querySelectorAll('.kv-grid-item img');
        const photographyItems = document.querySelectorAll('.photography-grid-item img');
        const packagingItems = document.querySelectorAll('.packaging-grid-item img');
        const campaignItems = document.querySelectorAll('.campaign-grid-item img');
        const uiDesignItems = document.querySelectorAll('.ui-design-grid-item img');
        const ipDesignItems = document.querySelectorAll('.ip-design-grid-item img'); // 添加IP设计图片项
        const fontDesignItems = document.querySelectorAll('.font-design-grid-item img'); // 添加字体设计图片项
        const intelligentItems = document.querySelectorAll('.intelligent-grid-item img'); // 添加智能设计图片项
        
        console.log('UI设计图片项数量:', uiDesignItems.length);
        console.log('IP设计图片项数量:', ipDesignItems.length);
        console.log('字体设计图片项数量:', fontDesignItems.length);
        console.log('智能设计图片项数量:', intelligentItems.length);
        
        // 合并所有图片项
        const allGridItems = [
            ...Array.from(kvItems), 
            ...Array.from(photographyItems), 
            ...Array.from(packagingItems),
            ...Array.from(campaignItems),
            ...Array.from(uiDesignItems),
            ...Array.from(ipDesignItems),
            ...Array.from(fontDesignItems),
            ...Array.from(intelligentItems)
        ];
        
        // 为每个图片项添加点击事件
        allGridItems.forEach(img => {
            // 移除现有的点击事件处理程序（如果有）
            const clonedImg = img.cloneNode(true);
            if (img.parentNode) {
                img.parentNode.replaceChild(clonedImg, img);
            }
            
            // 为克隆的图片添加新的点击事件
            clonedImg.addEventListener('click', function() {
                // 获取图片URL
                const imgUrl = this.getAttribute('src');
                // 获取所在的网格项
                const gridItem = this.closest('.kv-grid-item, .photography-grid-item, .packaging-grid-item, .campaign-grid-item, .ui-design-grid-item, .ip-design-grid-item, .font-design-grid-item, .intelligent-grid-item');
                if (!gridItem) {
                    console.error('无法找到图片的网格项');
                    return;
                }
                
                // 获取索引
                const index = gridItem ? parseInt(gridItem.getAttribute('data-index')) : 0;
                
                // 确定分类和筛选器
                let category = '';
                let filter = '';
                
                if (gridItem.classList.contains('kv-grid-item')) {
                    category = 'kv';
                    const activeFilter = document.querySelector('.kv-filter-buttons li.active');
                    filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'handdrawn';
                } else if (gridItem.classList.contains('photography-grid-item')) {
                    category = 'photography';
                    const activeFilter = document.querySelector('.photography-filter-buttons li.active');
                    filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'travel';
                } else if (gridItem.classList.contains('packaging-grid-item')) {
                    category = 'packaging';
                    const activeFilter = document.querySelector('.packaging-filter-buttons li.active');
                    filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'food';
                } else if (gridItem.classList.contains('campaign-grid-item')) {
                    category = 'campaign';
                    const activeFilter = document.querySelector('.campaign-filter-buttons li.active');
                    filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'longcontent';
                } else if (gridItem.classList.contains('ui-design-grid-item')) {
                    category = 'ui-design';
                    const activeFilter = document.querySelector('.ui-design-filter-buttons li.active');
                    filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'web';
                } else if (gridItem.classList.contains('ip-design-grid-item')) {
                    category = 'ip-design';
                    filter = 'ip'; // IP设计只有一个固定分类
                } else if (gridItem.classList.contains('font-design-grid-item')) {
                    category = 'font-design';
                    filter = 'font'; // 字体设计只有一个固定分类
                } else if (gridItem.classList.contains('intelligent-grid-item')) {
                    category = 'intelligent';
                    const activeFilter = document.querySelector('.intelligent-filter-buttons li.active');
                    filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'jieri';
                }
                
                console.log(`点击图片: ${imgUrl}, 分类=${category}, 过滤器=${filter}, 索引=${index}`);
                
                // 开始判断是否需要获取大图URL
                let fullImgUrl = imgUrl;
                let hasFullImage = false;
                
                // 食品和日用品包装有专门的大图
                if (category === 'packaging' && (filter === 'food' || filter === 'daily')) {
                    fullImgUrl = imgUrl.replace('.jpg', '_full.jpg');
                    hasFullImage = true;
                }
                
                // 打开灯箱
                openLightbox(hasFullImage ? fullImgUrl : imgUrl, index, hasFullImage, category, filter);
            });
        });
        
        // 确保创建灯箱
        createLightboxIfNeeded();
        
        console.log(`已为 ${allGridItems.length} 个图片项添加灯箱事件`);
    }

    // Isotope 初始化代码
    var $grid = $('.project-masonry-active').isotope({
        itemSelector: '.item',
        layoutMode: 'fitRows',
        // 添加以下选项以解决火狐浏览器问题
        fitRows: {
            gutter: 0  // 确保没有额外的间距
        }
    });
    
    // 在窗口调整大小时重新布局
    $(window).on('resize', function() {
        $grid.isotope('layout');
    });
    
    // 强制在火狐浏览器中重新计算布局
    if(navigator.userAgent.indexOf("Firefox") > -1) {
        setTimeout(function() {
            $grid.isotope('layout');
        }, 100);
    }
    
    // 绑定过滤器点击事件
    $('.project-filter li').on('click', function() {
        var filterValue = $(this).attr('data-filter');
        $('.project-filter li').removeClass('current');
        $(this).addClass('current');
        
        // 如果不是"精选活动"，则隐藏所有项目
        if (filterValue !== '.featured') {
            $grid.isotope({ filter: '.non-existent-class' }); // 使用一个不存在的类来隐藏所有项目
        } else {
            $grid.isotope({ filter: filterValue });
        }
        
        // 添加以下代码，确保灯箱正确初始化
        if (filterValue === '.kv-design' || filterValue === '.photography' || 
            filterValue === '.packaging' || filterValue === '.campaign' || 
            filterValue === '.ui-design' || filterValue === '.ip-design' || 
            filterValue === '.font-design' || filterValue === '.intelligent') {
            setTimeout(function() {
                createLightboxIfNeeded();
                setupLightboxImageListeners();
            }, 500);
            
            // 显示对应的画廊容器并隐藏其他容器
            $('#kv-gallery-container, #photography-gallery-container, #packaging-gallery-container, #campaign-gallery-container, #ui-design-gallery-container, #ip-design-gallery-container, #font-design-gallery-container, #intelligent-gallery-container').addClass('d-none');
            
            if (filterValue === '.kv-design') {
                $('#kv-gallery-container').removeClass('d-none');
                if (!window.kvCategoriesInitialized) {
                    initializeKVCategories().then(function() {
                        window.kvCategoriesInitialized = true;
                    });
                }
            } else if (filterValue === '.photography') {
                $('#photography-gallery-container').removeClass('d-none');
                if (!window.photographyCategoriesInitialized) {
                    initializePhotographyCategories().then(function() {
                        window.photographyCategoriesInitialized = true;
                    });
                }
            } else if (filterValue === '.packaging') {
                $('#packaging-gallery-container').removeClass('d-none');
                if (!window.packagingCategoriesInitialized) {
                    initializePackagingCategories().then(function() {
                        window.packagingCategoriesInitialized = true;
                    });
                }
            } else if (filterValue === '.campaign') {
                $('#campaign-gallery-container').removeClass('d-none');
                if (!window.campaignCategoriesInitialized) {
                    initializeCampaignCategories().then(function() {
                        window.campaignCategoriesInitialized = true;
                    });
                }
            } else if (filterValue === '.ui-design') {
                $('#ui-design-gallery-container').removeClass('d-none');
                if (!window.uiDesignCategoriesInitialized) {
                    initializeUIDesignCategories().then(function() {
                        window.uiDesignCategoriesInitialized = true;
                    });
                }
            } else if (filterValue === '.ip-design') {
                $('#ip-design-gallery-container').removeClass('d-none');
                // 直接加载 IP 设计图片
                window.loadIPDesignImages(1);
            } else if (filterValue === '.font-design') {
                $('#font-design-gallery-container').removeClass('d-none');
                // 直接加载字体设计图片
                window.loadFontDesignImages(1);
            } else if (filterValue === '.intelligent') {
                $('#intelligent-gallery-container').removeClass('d-none');
                if (!window.intelligentCategoriesInitialized) {
                    initializeIntelligentCategories().then(function() {
                        window.intelligentCategoriesInitialized = true;
                    });
                }
            }
        }
        
        return false;
    });

    // UI设计分类初始化函数
    function initializeUIDesignCategories() {
        return new Promise((resolve) => {
            try {
                console.log('开始初始化UI设计分类标签');
                const categories = Object.keys(uiDesignFolderDisplayNames);
                const filterContainer = document.querySelector('.ui-design-filter-buttons');
                
                if (!filterContainer) {
                    console.error('找不到UI设计过滤器容器');
                    resolve(false);
                    return;
                }
                
                // 清空现有按钮以避免重复
                filterContainer.innerHTML = '';
                
                // 添加各个分类按钮
                categories.forEach((category, index) => {
                    const btn = document.createElement('li');
                    btn.setAttribute('data-filter', category);
                    btn.textContent = uiDesignFolderDisplayNames[category] || category;
                    
                    // 第一个分类设为活动状态
                    if (index === 0) {
                        btn.classList.add('active');
                    }
                    
                    filterContainer.appendChild(btn);
                });
                
                // 委托事件到父容器
                filterContainer.addEventListener('click', function(e) {
                    const target = e.target.closest('li');
                    if (!target) return;
                    
                    document.querySelectorAll('.ui-design-filter-buttons li').forEach(li => {
                        li.classList.remove('active');
                    });
                    target.classList.add('active');
                    
                    const filter = target.getAttribute('data-filter');
                    console.log(`点击UI设计分类标签: ${filter}`);
                    
                    // 更新加载按钮状态
                    const loadMoreBtn = document.getElementById('load-more-ui-design');
                    if (loadMoreBtn) {
                        loadMoreBtn.setAttribute('data-filter', filter);
                        loadMoreBtn.setAttribute('data-page', '1');
                        loadMoreBtn.textContent = '加载更多';
                        loadMoreBtn.disabled = false;
                    }
                    
                    // 加载图片
                    window.loadUIDesignImages(filter, 1);
                });
                
                console.log(`UI设计分类标签创建完成: ${categories.join(', ')}`);
                
                // 在加载完成后添加
                setupLightboxImageListeners();
                
                resolve(true);
            } catch (error) {
                console.error('初始化UI设计分类标签失败:', error);
                resolve(false);
            }
        });
    }
    
    // 确保在页面加载完成后初始化UI设计分类
    initializeUIDesignCategories().then(success => {
        if (success) {
            console.log('UI设计分类初始化成功');
            // 加载第一个分类的图片
            const firstCategory = Object.keys(uiDesignFolderDisplayNames)[0] || 'web';
            
            // 确保加载按钮正确设置
            const loadMoreBtn = document.getElementById('load-more-ui-design');
            if (loadMoreBtn) {
                loadMoreBtn.setAttribute('data-filter', firstCategory);
                loadMoreBtn.setAttribute('data-page', '1');
            }
            
            // 加载第一个分类的图片
            window.loadUIDesignImages(firstCategory, 1);
        } else {
            console.error('UI设计分类初始化失败');
        }
    });
    
    // 为UI设计加载更多按钮添加点击事件
    const loadMoreUIDesignBtn = document.getElementById('load-more-ui-design');
    if (loadMoreUIDesignBtn) {
        loadMoreUIDesignBtn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter') || 'web';
            const page = parseInt(this.getAttribute('data-page') || '1') + 1;
            
            console.log(`UI设计加载更多按钮点击: 分类=${filter}, 页码=${page}`);
            this.setAttribute('data-page', page);
            
            window.loadUIDesignImages(filter, page);
        });
    }
    
    // 添加UI设计图片加载函数
    window.loadUIDesignImages = function(filter, page) {
        window.loadImages({
            category: 'ui-design',
            filter: filter,
            page: page,
            cloudBaseUrl: uiDesignCloudBaseUrl,
            useCloud: true,
            append: page > 1
        });
    };

    // 添加 IP 设计图片数量配置
    window.ipDesignMaxIndex = 50; // 假设IP设计文件夹中有50张图片，您可以根据实际情况调整

    // 添加 IP 设计图片加载函数
    window.loadIPDesignImages = function(page) {
        console.log(`加载IP设计图片: 页码=${page}`);
        window.loadImages({
            category: 'ip-design',
            filter: 'ip',
            page: page
        });
    };
    
    // 添加字体设计图片加载函数
    window.loadFontDesignImages = function(page) {
        console.log(`加载字体设计图片: 页码=${page}`);
        window.loadImages({
            category: 'font-design',
            filter: 'font',
            page: page,
            cloudBaseUrl: fontDesignCloudBaseUrl,
            useCloud: true,
            append: page > 1
        });
    };
    
    // 为字体设计加载更多按钮添加点击事件
    const loadMoreFontDesignBtn = document.getElementById('load-more-font-design');
    if (loadMoreFontDesignBtn) {
        loadMoreFontDesignBtn.addEventListener('click', function() {
            const page = parseInt(this.getAttribute('data-page') || '1') + 1;
            
            console.log(`字体设计加载更多按钮点击: 页码=${page}`);
            this.setAttribute('data-page', page);
            
            window.loadFontDesignImages(page);
        });
    }
    
    // 定义一个全局变量来追踪智能设计masonry实例
    window.intelligentMasonry = null;
    
    // 初始化智能设计分类
    function initializeIntelligentCategories() {
        return new Promise((resolve) => {
            try {
                console.log('开始初始化智能设计分类标签');
                const categories = Object.keys(intelligentFolderDisplayNames);
                const filterContainer = document.querySelector('.intelligent-filter-buttons');
                
                if (!filterContainer) {
                    console.error('找不到智能设计过滤器容器');
                    resolve(false);
                    return;
                }
                
                // 清空现有按钮以避免重复
                filterContainer.innerHTML = '';
                
                // 添加各个分类按钮
                categories.forEach((category, index) => {
                    const btn = document.createElement('li');
                    btn.setAttribute('data-filter', category);
                    btn.textContent = intelligentFolderDisplayNames[category] || category;
                    
                    // 第一个分类设为活动状态
                    if (index === 0) {
                        btn.classList.add('active');
                    }
                    
                    filterContainer.appendChild(btn);
                });
                
                // 委托事件到父容器
                filterContainer.addEventListener('click', function(e) {
                    const target = e.target.closest('li');
                    if (!target) return;
                    
                    document.querySelectorAll('.intelligent-filter-buttons li').forEach(li => {
                        li.classList.remove('active');
                    });
                    target.classList.add('active');
                    
                    const filter = target.getAttribute('data-filter');
                    console.log(`点击智能设计分类标签: ${filter}`);
                    
                    // 更新加载按钮状态
                    const loadMoreBtn = document.getElementById('load-more-intelligent');
                    if (loadMoreBtn) {
                        loadMoreBtn.setAttribute('data-filter', filter);
                        loadMoreBtn.setAttribute('data-page', '1');
                        loadMoreBtn.textContent = '加载更多';
                        loadMoreBtn.disabled = false;
                    }
                    
                    // 加载图片
                    window.loadIntelligentImages(filter, 1);
                });
                
                console.log(`智能设计分类标签创建完成: ${categories.join(', ')}`);
                
                // 在加载完成后添加
                setupLightboxImageListeners();
                
                // 加载第一个分类的图片
                const firstCategory = categories[0] || 'jieri';
                window.loadIntelligentImages(firstCategory, 1);
                
                resolve(true);
            } catch (error) {
                console.error('初始化智能设计分类标签失败:', error);
                resolve(false);
            }
        });
    }
    
    // 为加载更多按钮添加点击事件
    const loadMoreIntelligentBtn = document.getElementById('load-more-intelligent');
    if (loadMoreIntelligentBtn) {
        loadMoreIntelligentBtn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter') || 'jieri';
            const page = parseInt(this.getAttribute('data-page') || '1') + 1;
            
            console.log(`智能设计加载更多按钮点击: 分类=${filter}, 页码=${page}`);
            this.setAttribute('data-page', page);
            
            window.loadIntelligentImages(filter, page);
        });
    }
    
    // 加载智能设计图片函数
    window.loadIntelligentImages = function(filter, page) {
        console.log('尝试加载智能设计图片:', filter, page);
        
        // 获取网格容器
        const gridGallery = document.querySelector('.intelligent-grid-gallery');
        if (!gridGallery) return;
        
        // 仅在切换分类（page=1）时重置布局
        if (page === 1) {
            console.log('首次加载，重置布局');
            // 完全清空容器内容
            gridGallery.innerHTML = '';
            
            // 重置网格容器样式
            gridGallery.style = '';
            
            // 销毁之前的masonry实例
            if (window.intelligentMasonry) {
                if (typeof window.intelligentMasonry.destroy === 'function') {
                    window.intelligentMasonry.destroy();
                }
                window.intelligentMasonry = null;
            }
        } else {
            console.log('加载更多，保留已有内容');
            // 加载更多时，不清空容器，不重置布局
        }
        
        // 加载图片
        window.loadImages({
            category: 'intelligent',
            filter: filter,
            page: page,
            cloudBaseUrl: intelligentCloudBaseUrl,
            append: page > 1 // 关键参数：当page>1时追加内容而不是替换
        });
        
        // 在图片加载后进行布局处理
        setTimeout(function() {
            // 使用Masonry布局替代CSS Grid布局
            if (typeof Masonry !== 'undefined') {
                if (page === 1) {
                    // 首次加载，创建新实例
                    window.intelligentMasonry = new Masonry(gridGallery, {
                        itemSelector: '.intelligent-grid-item',
                        percentPosition: true,
                        transitionDuration: 0,
                        columnWidth: '.intelligent-grid-item',
                        gutter: 20 // 设置图片间的间距
                    });
                    console.log('智能设计Masonry布局已初始化');
                } else {
                    // 加载更多，更新现有实例
                    if (window.intelligentMasonry) {
                        window.intelligentMasonry.reloadItems();
                        window.intelligentMasonry.layout();
                        console.log('智能设计Masonry布局已更新');
                    } else {
                        // 如果实例不存在（可能是因为页面刷新），创建新实例
                        window.intelligentMasonry = new Masonry(gridGallery, {
                            itemSelector: '.intelligent-grid-item',
                            percentPosition: true,
                            transitionDuration: 0,
                            columnWidth: '.intelligent-grid-item',
                            gutter: 20 // 设置图片间的间距
                        });
                        console.log('智能设计Masonry布局已初始化（加载更多时）');
                    }
                }
            } else {
                console.error('Masonry库未加载！');
                // 触发浏览器重新计算布局作为后备方案
                window.dispatchEvent(new Event('resize'));
            }
            
            // 确保图片加载后显示容器
            document.getElementById('intelligent-gallery-container').classList.remove('d-none');
        }, 500);
    };
}); 