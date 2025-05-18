/**
 * security-monitor.js - 安全监控界面交互逻辑
 */

(function() {
    // 安全监控界面命名空间
    window.SecurityMonitor = {};
    
    // 初始化安全监控界面
    function initSecurityMonitor() {
        // 获取DOM元素
        const securityIndicator = document.getElementById('security-indicator');
        const securityModal = document.getElementById('security-monitor-modal');
        const closeButton = securityModal.querySelector('.close-button');
        const securityTabs = document.querySelectorAll('.security-tab');
        const securityTabContents = document.querySelectorAll('.security-tab-content');
        
        // 绑定点击事件
        if (securityIndicator) {
            securityIndicator.addEventListener('click', function() {
                securityModal.style.display = 'flex';
                refreshSecurityLogs();
            });
        }
        
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                securityModal.style.display = 'none';
            });
        }
        
        // 点击模态框外部关闭
        window.addEventListener('click', function(event) {
            if (event.target === securityModal) {
                securityModal.style.display = 'none';
            }
        });
        
        // 标签切换
        securityTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 移除所有活动标签
                securityTabs.forEach(t => t.classList.remove('active'));
                securityTabContents.forEach(c => c.classList.remove('active'));
                
                // 添加当前活动标签
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
                
                // 如果是日志标签，刷新日志
                if (tabId === 'security-logs') {
                    refreshSecurityLogs();
                }
            });
        });
        
        // 日志控制按钮
        const refreshLogsBtn = document.getElementById('refresh-logs');
        const clearLogsBtn = document.getElementById('clear-logs');
        
        if (refreshLogsBtn) {
            refreshLogsBtn.addEventListener('click', refreshSecurityLogs);
        }
        
        if (clearLogsBtn) {
            clearLogsBtn.addEventListener('click', clearSecurityLogs);
        }
        
        // 设置表单控制
        const saveSettingsBtn = document.getElementById('save-security-settings');
        const resetSettingsBtn = document.getElementById('reset-security-settings');
        
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', saveSecuritySettings);
        }
        
        if (resetSettingsBtn) {
            resetSettingsBtn.addEventListener('click', resetSecuritySettings);
        }
        
        // 加载保存的设置
        loadSecuritySettings();
        
        console.log('安全监控界面已初始化');
    }
    
    /**
     * 刷新安全日志
     */
    function refreshSecurityLogs() {
        const logTableBody = document.getElementById('security-log-entries');
        const emptyMessage = document.getElementById('log-empty-message');
        
        if (!logTableBody) return;
        
        // 清空当前日志
        logTableBody.innerHTML = '';
        
        // 获取安全日志
        const securityLogs = HotSecurity.secureRetrieve('security_logs') || [];
        
        if (securityLogs.length === 0) {
            if (emptyMessage) {
                emptyMessage.style.display = 'block';
            }
            return;
        }
        
        if (emptyMessage) {
            emptyMessage.style.display = 'none';
        }
        
        // 按时间倒序排序日志
        securityLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // 渲染日志
        securityLogs.forEach(log => {
            const row = document.createElement('tr');
            
            // 格式化时间
            const date = new Date(log.timestamp);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            
            // 确定严重性
            let severity = 'low';
            if (['auth_failure', 'xss_attempt', 'data_breach'].includes(log.eventType)) {
                severity = 'high';
            } else if (['form_validation', 'csrf_mismatch', 'suspicious_activity'].includes(log.eventType)) {
                severity = 'medium';
            }
            
            // 事件类型映射为中文
            const eventTypeMap = {
                'security_init': '安全初始化',
                'form_validation': '表单验证',
                'auth_failure': '认证失败',
                'xss_attempt': 'XSS攻击尝试',
                'data_breach': '数据泄露',
                'csrf_mismatch': 'CSRF令牌不匹配',
                'suspicious_activity': '可疑活动',
                'encryption_error': '加密错误',
                'settings_change': '安全设置更改'
            };
            
            const eventTypeText = eventTypeMap[log.eventType] || log.eventType;
            
            // 设置单元格内容
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${eventTypeText}</td>
                <td>${log.description}</td>
                <td class="severity-${severity}">${
                    severity === 'high' ? '高' : 
                    severity === 'medium' ? '中' : '低'
                }</td>
            `;
            
            logTableBody.appendChild(row);
        });
    }
    
    /**
     * 清除安全日志
     */
    function clearSecurityLogs() {
        if (confirm('确定要清除所有安全日志吗？')) {
            localStorage.removeItem('security_logs');
            refreshSecurityLogs();
            HotSecurity.logSecurityEvent('settings_change', '安全日志已清除');
        }
    }
    
    /**
     * 加载安全设置
     */
    function loadSecuritySettings() {
        const settings = HotSecurity.secureRetrieve('security_settings') || {
            encryption: true,
            csrf: true,
            xss: true,
            validation: true,
            storage: true,
            logging: true
        };
        
        // 设置开关状态
        document.getElementById('encryption-enabled').checked = settings.encryption;
        document.getElementById('csrf-protection').checked = settings.csrf;
        document.getElementById('xss-protection').checked = settings.xss;
        document.getElementById('strict-validation').checked = settings.validation;
        document.getElementById('secure-storage').checked = settings.storage;
        document.getElementById('security-logging').checked = settings.logging;
        
        updateSecurityStatus(settings);
    }
    
    /**
     * 保存安全设置
     */
    function saveSecuritySettings() {
        const settings = {
            encryption: document.getElementById('encryption-enabled').checked,
            csrf: document.getElementById('csrf-protection').checked,
            xss: document.getElementById('xss-protection').checked,
            validation: document.getElementById('strict-validation').checked,
            storage: document.getElementById('secure-storage').checked,
            logging: document.getElementById('security-logging').checked
        };
        
        HotSecurity.secureStore('security_settings', settings);
        updateSecurityStatus(settings);
        
        HotSecurity.logSecurityEvent('settings_change', '安全设置已更新');
        
        alert('安全设置已保存');
    }
    
    /**
     * 重置安全设置
     */
    function resetSecuritySettings() {
        if (confirm('确定要重置所有安全设置为默认值吗？')) {
            const defaultSettings = {
                encryption: true,
                csrf: true,
                xss: true,
                validation: true,
                storage: true,
                logging: true
            };
            
            document.getElementById('encryption-enabled').checked = true;
            document.getElementById('csrf-protection').checked = true;
            document.getElementById('xss-protection').checked = true;
            document.getElementById('strict-validation').checked = true;
            document.getElementById('secure-storage').checked = true;
            document.getElementById('security-logging').checked = true;
            
            HotSecurity.secureStore('security_settings', defaultSettings);
            updateSecurityStatus(defaultSettings);
            
            HotSecurity.logSecurityEvent('settings_change', '安全设置已重置为默认值');
        }
    }
    
    /**
     * 更新安全状态显示
     */
    function updateSecurityStatus(settings) {
        const statusCards = document.querySelectorAll('.status-card');
        
        // 加密状态
        const encryptionStatus = statusCards[0].querySelector('.status-value');
        const encryptionDot = encryptionStatus.querySelector('.status-dot');
        
        if (settings.encryption) {
            encryptionDot.className = 'status-dot green';
            encryptionStatus.innerHTML = encryptionStatus.innerHTML.replace(/[^<]*<\/span>/, '<span class="status-dot green"></span> 已启用');
        } else {
            encryptionDot.className = 'status-dot red';
            encryptionStatus.innerHTML = encryptionStatus.innerHTML.replace(/[^<]*<\/span>/, '<span class="status-dot red"></span> 已禁用');
        }
        
        // CSRF防护
        const csrfStatus = statusCards[1].querySelector('.status-value');
        const csrfDot = csrfStatus.querySelector('.status-dot');
        
        if (settings.csrf) {
            csrfDot.className = 'status-dot green';
            csrfStatus.innerHTML = csrfStatus.innerHTML.replace(/[^<]*<\/span>/, '<span class="status-dot green"></span> 已启用');
        } else {
            csrfDot.className = 'status-dot red';
            csrfStatus.innerHTML = csrfStatus.innerHTML.replace(/[^<]*<\/span>/, '<span class="status-dot red"></span> 已禁用');
        }
        
        // XSS防护
        const xssStatus = statusCards[2].querySelector('.status-value');
        const xssDot = xssStatus.querySelector('.status-dot');
        
        if (settings.xss) {
            xssDot.className = 'status-dot green';
            xssStatus.innerHTML = xssStatus.innerHTML.replace(/[^<]*<\/span>/, '<span class="status-dot green"></span> 已启用');
        } else {
            xssDot.className = 'status-dot red';
            xssStatus.innerHTML = xssStatus.innerHTML.replace(/[^<]*<\/span>/, '<span class="status-dot red"></span> 已禁用');
        }
        
        // 数据验证
        const validationStatus = statusCards[3].querySelector('.status-value');
        const validationDot = validationStatus.querySelector('.status-dot');
        
        if (settings.validation) {
            validationDot.className = 'status-dot green';
            validationStatus.innerHTML = validationStatus.innerHTML.replace(/[^<]*<\/span>/, '<span class="status-dot green"></span> 已启用');
        } else {
            validationDot.className = 'status-dot yellow';
            validationStatus.innerHTML = validationStatus.innerHTML.replace(/[^<]*<\/span>/, '<span class="status-dot yellow"></span> 部分启用');
        }
        
        // 安全存储
        const storageStatus = statusCards[4].querySelector('.status-value');
        const storageDot = storageStatus.querySelector('.status-dot');
        
        if (settings.storage) {
            storageDot.className = 'status-dot green';
            storageStatus.innerHTML = storageStatus.innerHTML.replace(/[^<]*<\/span>/, '<span class="status-dot green"></span> 已启用');
        } else {
            storageDot.className = 'status-dot red';
            storageStatus.innerHTML = storageStatus.innerHTML.replace(/[^<]*<\/span>/, '<span class="status-dot red"></span> 已禁用');
        }
        
        // 安全日志
        const loggingStatus = statusCards[5].querySelector('.status-value');
        const loggingDot = loggingStatus.querySelector('.status-dot');
        
        if (settings.logging) {
            loggingDot.className = 'status-dot green';
            loggingStatus.innerHTML = loggingStatus.innerHTML.replace(/[^<]*<\/span>/, '<span class="status-dot green"></span> 已启用');
        } else {
            loggingDot.className = 'status-dot red';
            loggingStatus.innerHTML = loggingStatus.innerHTML.replace(/[^<]*<\/span>/, '<span class="status-dot red"></span> 已禁用');
        }
        
        // 更新指示器颜色
        const securityIndicator = document.getElementById('security-indicator');
        const activeSettings = Object.values(settings).filter(Boolean).length;
        
        if (activeSettings === 6) {
            securityIndicator.style.borderColor = 'rgba(76, 175, 80, 0.6)';
            securityIndicator.querySelector('.security-icon').style.color = '#4CAF50';
        } else if (activeSettings >= 4) {
            securityIndicator.style.borderColor = 'rgba(255, 193, 7, 0.6)';
            securityIndicator.querySelector('.security-icon').style.color = '#FFC107';
        } else {
            securityIndicator.style.borderColor = 'rgba(244, 67, 54, 0.6)';
            securityIndicator.querySelector('.security-icon').style.color = '#F44336';
        }
    }
    
    // 页面加载时初始化安全监控界面
    document.addEventListener('DOMContentLoaded', function() {
        // 确保HotSecurity模块已加载
        if (window.HotSecurity) {
            initSecurityMonitor();
        } else {
            console.error('HotSecurity模块未加载，无法初始化安全监控界面');
        }
    });
    
    // 导出安全监控界面模块
    window.SecurityMonitor = {
        refresh: refreshSecurityLogs,
        clear: clearSecurityLogs,
        saveSettings: saveSecuritySettings,
        resetSettings: resetSecuritySettings
    };
})(); 