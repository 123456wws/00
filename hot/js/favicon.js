// favicon.js - 网站图标设置
(function() {
    // 直接设置favicon为hot.ico，不再动态生成
    function setFavicon() {
        // 设置favicon (使用预先准备好的ICO文件)
        const link = document.querySelector('link[rel="icon"]') || 
                    document.querySelector('link[rel="shortcut icon"]');
        
        if (link) {
            // 更新现有的favicon链接为ICO格式
            link.href = 'icons/hot.ico';
            link.type = 'image/x-icon';
        } else {
            // 创建新的favicon链接
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = 'icons/hot.ico';
            newLink.type = 'image/x-icon';
            document.head.appendChild(newLink);
            
            // 添加Apple Touch Icon (使用同样的图像)
            const appleLink = document.createElement('link');
            appleLink.rel = 'apple-touch-icon';
            appleLink.href = 'icons/hot.ico';
            document.head.appendChild(appleLink);
        }
        
        console.log('Favicon设置完成: hot.ico');
    }
    
    // 在页面加载时设置favicon
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setFavicon);
    } else {
        setFavicon();
    }
})(); 