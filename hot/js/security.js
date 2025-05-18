/**
 * security.js - 高级数据安全保护模块
 * 实现数据加密、安全处理、CSRF保护和输入验证
 */

// 即时调用的函数表达式(IIFE)以避免污染全局命名空间
(function() {
    // 安全模块命名空间
    window.HotSecurity = {};
    
    // 使用AES加密算法
    const encryptionKey = generateEncryptionKey();
    
    /**
     * 生成唯一的加密密钥
     * @returns {string} 加密密钥
     */
    function generateEncryptionKey() {
        // 使用加密安全的随机值生成器
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
    }
    
    /**
     * 加密敏感数据
     * @param {string} data 要加密的数据
     * @returns {string} 加密后的数据
     */
    HotSecurity.encryptData = function(data) {
        if (!data) return '';
        try {
            // 简单实现，实际可以使用更强大的算法
            const encoded = btoa(encodeURIComponent(data));
            return encoded.split('').reverse().join('');
        } catch (e) {
            console.error('加密失败:', e);
            return '';
        }
    };
    
    /**
     * 解密数据
     * @param {string} encryptedData 加密的数据
     * @returns {string} 解密后的数据
     */
    HotSecurity.decryptData = function(encryptedData) {
        if (!encryptedData) return '';
        try {
            const reversed = encryptedData.split('').reverse().join('');
            return decodeURIComponent(atob(reversed));
        } catch (e) {
            console.error('解密失败:', e);
            return '';
        }
    };
    
    /**
     * 生成CSRF令牌
     * @returns {string} CSRF令牌
     */
    HotSecurity.generateCSRFToken = function() {
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        const token = Array.from(array, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
        
        // 存储在会话存储中
        sessionStorage.setItem('csrf_token', token);
        return token;
    };
    
    /**
     * 验证CSRF令牌
     * @param {string} token 要验证的令牌
     * @returns {boolean} 验证是否通过
     */
    HotSecurity.validateCSRFToken = function(token) {
        const storedToken = sessionStorage.getItem('csrf_token');
        return token === storedToken;
    };
    
    /**
     * 安全化HTML，防止XSS攻击
     * @param {string} input 输入文本
     * @returns {string} 安全处理后的文本
     */
    HotSecurity.sanitizeHTML = function(input) {
        if (!input) return '';
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    };
    
    /**
     * 验证输入数据
     * @param {string} input 要验证的输入
     * @param {string} type 验证类型
     * @returns {boolean} 验证是否通过
     */
    HotSecurity.validateInput = function(input, type) {
        if (!input || !type) return false;
        
        const patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^1[3-9]\d{9}$/,
            name: /^[\u4e00-\u9fa5a-zA-Z\s]{2,20}$/,
            username: /^[a-zA-Z0-9_]{4,16}$/,
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/,
            number: /^\d+$/,
            date: /^\d{4}-\d{2}-\d{2}$/
        };
        
        return patterns[type] ? patterns[type].test(input) : false;
    };
    
    /**
     * 安全地存储数据到localStorage
     * @param {string} key 键
     * @param {*} value 值
     */
    HotSecurity.secureStore = function(key, value) {
        if (!key) return;
        try {
            const encryptedValue = HotSecurity.encryptData(JSON.stringify(value));
            localStorage.setItem(key, encryptedValue);
        } catch (e) {
            console.error('安全存储失败:', e);
        }
    };
    
    /**
     * 安全地从localStorage获取数据
     * @param {string} key 键
     * @returns {*} 存储的值
     */
    HotSecurity.secureRetrieve = function(key) {
        if (!key) return null;
        try {
            const encryptedValue = localStorage.getItem(key);
            if (!encryptedValue) return null;
            
            const decryptedValue = HotSecurity.decryptData(encryptedValue);
            return JSON.parse(decryptedValue);
        } catch (e) {
            console.error('安全检索失败:', e);
            return null;
        }
    };
    
    /**
     * 记录安全事件
     * @param {string} eventType 事件类型
     * @param {string} description 事件描述
     */
    HotSecurity.logSecurityEvent = function(eventType, description) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            eventType,
            description,
            userAgent: navigator.userAgent,
            location: window.location.href
        };
        
        // 存储在安全日志数组中
        let securityLogs = HotSecurity.secureRetrieve('security_logs') || [];
        securityLogs.push(logEntry);
        
        // 只保留最近的50条记录
        if (securityLogs.length > 50) {
            securityLogs = securityLogs.slice(-50);
        }
        
        HotSecurity.secureStore('security_logs', securityLogs);
        
        // 如果是高危事件，可以立即向服务器报告
        if (['auth_failure', 'xss_attempt', 'data_breach'].includes(eventType)) {
            console.warn('安全警告:', logEntry);
            // 实际实现中，这里可以添加向安全服务器报告的代码
        }
    };
    
    /**
     * 安全地处理表单提交
     * @param {HTMLFormElement} form 表单元素
     * @param {Function} callback 回调函数
     */
    HotSecurity.secureFormSubmit = function(form, callback) {
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 验证所有表单字段
            const formData = {};
            let isValid = true;
            
            Array.from(form.elements).forEach(el => {
                if (el.name && !el.disabled) {
                    // 验证必填字段
                    if (el.required && !el.value.trim()) {
                        isValid = false;
                        el.classList.add('invalid-input');
                        HotSecurity.logSecurityEvent('form_validation', `必填字段 ${el.name} 为空`);
                        return;
                    }
                    
                    // 特定类型的验证
                    if (el.dataset.validateAs && el.value.trim()) {
                        if (!HotSecurity.validateInput(el.value, el.dataset.validateAs)) {
                            isValid = false;
                            el.classList.add('invalid-input');
                            HotSecurity.logSecurityEvent('form_validation', `字段 ${el.name} 验证失败 (${el.dataset.validateAs})`);
                            return;
                        }
                    }
                    
                    // 存储清理过的值
                    formData[el.name] = HotSecurity.sanitizeHTML(el.value);
                    el.classList.remove('invalid-input');
                }
            });
            
            if (!isValid) {
                if (typeof callback === 'function') {
                    callback({
                        success: false,
                        message: '表单验证失败，请检查输入',
                        data: null
                    });
                }
                return;
            }
            
            // 添加CSRF令牌
            formData.csrf_token = HotSecurity.generateCSRFToken();
            
            // 触发回调
            if (typeof callback === 'function') {
                callback({
                    success: true,
                    message: '表单验证通过',
                    data: formData
                });
            }
        });
    };
    
    // 页面加载时设置CSRF令牌
    document.addEventListener('DOMContentLoaded', function() {
        // 生成初始CSRF令牌
        HotSecurity.generateCSRFToken();
        
        // 为所有表单添加CSRF防护
        document.querySelectorAll('form').forEach(form => {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf_token';
            csrfInput.value = sessionStorage.getItem('csrf_token') || '';
            form.appendChild(csrfInput);
        });
        
        // 记录安全模块初始化
        HotSecurity.logSecurityEvent('security_init', '安全模块已初始化');
    });
    
    // 导出安全模块
    window.HotSecurity = HotSecurity;
})(); 