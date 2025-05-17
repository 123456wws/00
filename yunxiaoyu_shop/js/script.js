// Import OpenAI SDK is no longer needed

// Define variables that need to be accessible globally
let navLinks, contentSections, hasInitializedHomepage = false;
let isNavigating = false; // Flag to prevent double transitions

// Run visitor counter initialization immediately with DOM checking
(function() {
    // Check if DOM is already available
    if (document.readyState === "loading") {
        // If DOM not yet ready, wait for DOMContentLoaded
        document.addEventListener("DOMContentLoaded", initVisitorCounter);
    } else {
        // DOM already loaded, run immediately
        initVisitorCounter();
    }
})();

document.addEventListener("DOMContentLoaded", function() {
    // --- Initialize Visitor Counter --- (already initialized above)
    // initVisitorCounter();
    
    // --- Get navigation elements ---
    navLinks = document.querySelectorAll(".nav-link");
    contentSections = document.querySelectorAll(".content-section");
    
    // --- Activate homepage once ---
    if (navLinks.length > 0 && contentSections.length > 0 && !hasInitializedHomepage) {
        hasInitializedHomepage = true;
        navLinks[0].classList.add("active-link");
        contentSections[0].style.display = "block";
        contentSections[0].classList.add("active-section");
        applyStaggeredAnimation(contentSections[0]);
    }
    
    // --- Constants and Global Variables ---
    const DOUBAO_API_KEY = "f95dd168-74d4-4c49-b0fd-f9e479dbe066"; // 豆包API Key
    const DEEPSEEK_API_KEY = "sk-3a447a296dd941fcb0da055ea84493f3"; // DeepSeek API Key  
    const TONGYI_API_KEY = "sk-a39e00a96c27430c8604138beaaf8219"; // 百炼 API Key
    const HOT_API_KEY = "sk-a39e00a96c27430c8604138beaaf8219"; // Hot API Key (原元宝)
    
    // API URLs
    const DOUBAO_API_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"; // 豆包API URL
    const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"; // DeepSeek API URL
    const TONGYI_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"; // 百炼 API URL
    const HOT_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"; // Hot API URL (原元宝)
    
    // 当前选择的模型 - 默认豆包
    let currentModel = "doubao";
    console.log("模型设置为:", currentModel);
    
    // 初始化OpenAI客户端 - 不再需要
    let openai = null;
    
    // 根据当前模型创建相应的OpenAI客户端 - 简化为仅打印信息
    function initializeOpenAIClient() {
        console.log("使用" + currentModel + "API");
    }
    
    // 初始化默认的客户端
    initializeOpenAIClient();
    
    const CHAT_HISTORY_KEY = "hot_chat_history";
    const MAX_HISTORY_MESSAGES = 10; // Keep last 10 messages (5 user, 5 bot) for context

    // --- Navigation Logic ---
    navLinks.forEach((link) => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            
            // Prevent multiple clicks/transitions
            if (isNavigating) return;
            isNavigating = true;
            
            navLinks.forEach(l => l.classList.remove("active-link"));
            contentSections.forEach(s => {
                s.classList.remove("active-section");
                s.style.display = "none"; // Ensure it's hidden before animation
            });
            this.classList.add("active-link");
            const targetSectionId = this.getAttribute("href");
            const targetSection = document.querySelector(targetSectionId);
            if (targetSection) {
                targetSection.style.display = "block"; // Make it visible for animation
                targetSection.classList.add("active-section");
                applyStaggeredAnimation(targetSection);
                
                // Scroll to the section - with a small offset from the top
                const yOffset = 20; 
                const y = targetSection.getBoundingClientRect().top + window.pageYOffset - yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
                
                // Reset navigation flag after animation completes
                setTimeout(() => {
                    isNavigating = false;
                }, 800); // Match this with your animation duration
            } else {
                isNavigating = false; // Reset flag if target not found
            }
        });
    });

    function applyStaggeredAnimation(section) {
        const itemsToAnimate = section.querySelectorAll(".tech-card, .process-step, .case-study-item, .faq-item, .testimonial-item");
        itemsToAnimate.forEach((item, idx) => {
            item.style.setProperty("--animation-order", idx + 1);
            item.style.animation = "none"; // Reset animation
            item.offsetHeight; // Trigger reflow to restart animation
            item.style.animation = ""; // Re-apply animation from CSS
        });
    }
    
    // Homepage initialization is now handled in the DOMContentLoaded event

    // --- Service Item Price Details Toggle ---
    document.querySelectorAll(".service-item .details-btn").forEach(button => {
        button.addEventListener("click", function() {
            const priceDetails = this.closest(".service-item").querySelector(".price-details");
            const isHidden = priceDetails.style.display === "none" || priceDetails.style.display === "";
            priceDetails.style.display = isHidden ? "block" : "none";
            this.textContent = isHidden ? "收起详情" : "查看详情";
            // Accessibility: Update ARIA attribute if you add one
        });
    });

    // --- Case Study Modal Logic (Using new content drafts) ---
    const caseModal = document.getElementById("case-modal");
    const modalCaseTitle = document.getElementById("modal-case-title");
    const modalCaseImage = document.getElementById("modal-case-image");
    const modalCaseDescription = document.getElementById("modal-case-description");
    const caseDetailTriggers = document.querySelectorAll(".case-details-trigger");
    const closeModalButton = caseModal ? caseModal.querySelector(".close-button") : null;

    // Fetch and populate case study details from MD files
    async function fetchMarkdownContent(filePath) {
        try {
            // This is a placeholder. In a real environment, you'd fetch the file.
            // For this sandbox, we'll simulate by using pre-defined content based on filePath.
            // This would typically be: const response = await fetch(filePath); const text = await response.text();
            if (filePath.includes("case_study_1")) return `### 案例一：赋能制造企业——复杂生产调度系统的智能优化与效率跃升\n\n**客户背景与挑战：**\n\n某大型离散制造业企业，其生产线涉及多工序、多设备、多订单并行处理，传统的人工排程方式效率低下...\n\n**Hot团队的解决方案：**\n\n1.  **深度需求调研与痛点分析**：我们与客户生产管理、工艺技术及IT部门进行了多轮深入访谈...\n2.  **定制化数学建模**：针对客户复杂的生产环境，我们构建了一个多目标、多约束的混合整数规划（MIP）模型...\n3.  **高效算法设计与实现**：鉴于模型的复杂性和求解效率要求，我们设计并实现了一种基于遗传算法与禁忌搜索相结合的启发式优化算法...\n4.  **可视化调度界面开发**：为方便生产管理人员使用和监控，我们开发了一套直观易用的可视化调度界面...\n5.  **系统集成与部署**：将优化调度系统与客户现有的ERP、MES系统进行有效集成...\n\n**项目成果与客户价值：**\n\n*   生产效率显著提升：平均订单完成时间缩短了 **25%**...\n*   设备利用率大幅提高：设备平均利用率从原先的65%提升至 **85%**...\n*   运营成本有效降低：年度综合运营成本降低约 **15%**...\n*   决策支持能力增强：可视化界面和实时数据为生产管理者提供了强有力的决策支持...\n*   客户评价："Hot团队的专业能力和敬业精神给我们留下了深刻印象..."`;
            if (filePath.includes("case_study_2")) return `### 案例二：助力初创腾飞——AI算法软件著作权快速获取与价值保护\n\n**客户背景与挑战：**\n\n一家专注于人工智能图像识别领域的初创科技公司，自主研发了一套具有创新性的缺陷检测算法...\n\n**Hot团队的解决方案：**\n\n1.  **精准需求对接与专业咨询**：我们首先与客户的技术负责人进行了深入沟通...\n2.  **核心材料梳理与规范化指导**：软著申请的核心在于源代码和说明文档的规范性...\n3.  **高质量设计说明书撰写**：针对AI算法类软著的特点，我们协助客户撰写了一份高质量的《软件设计说明书》...\n4.  **全程代办与快速提交**：在客户确认所有申请材料无误后，我们启动了全程代办服务...\n5.  **进度透明与及时反馈**：在整个申请过程中，我们定期向客户通报申请进度...\n\n**项目成果与客户价值：**\n\n*   快速获得软著证书：该公司的AI算法软件著作权申请在远低于平均周期的时间内顺利通过审查...\n*   核心技术得到有效保护：软著证书的获得，为客户的核心AI算法提供了有力的法律保护...\n*   提升企业无形资产价值：软件著作权作为重要的无形资产，显著提升了该初创公司的整体估值...\n*   增强市场竞争力与品牌信誉：拥有自主知识产权的AI算法，使该公司在市场竞争中更具优势...\n*   客户评价："Hot团队的软著申请服务非常专业、高效！..."`;
            if (filePath.includes("case_study_3")) return `### 案例三：赋能科研创新——交互式数据可视化平台的定制开发与洞察深化\n\n**客户背景与挑战：**\n\n某知名大学的生物信息学研究团队，在进行一项复杂基因组学研究时，积累了海量的多维度实验数据...\n\n**Hot团队的解决方案：**\n\n1.  **深度科研需求理解与功能规划**：我们与研究团队的核心成员进行了多次深入的技术研讨...\n2.  **定制化平台架构设计与技术选型**：考虑到数据量、交互性能和未来扩展性，我们为该平台设计了前后端分离的架构...\n3.  **多维度交互式可视化模块开发**：根据科研需求，我们逐一开发了多个核心可视化模块...\n4.  **用户友好的操作界面与数据管理**：我们设计了简洁直观的操作界面...\n5.  **持续迭代与科研支持**：在平台开发和部署过程中，我们与研究团队保持紧密沟通...\n\n**项目成果与客户价值：**\n\n*   科研效率大幅提升：数据分析和洞察发现的时间平均缩短了 **60%** 以上...\n*   科学发现的深化与加速：已有多篇高质量论文发表...\n*   团队协作与知识共享增强：平台支持项目数据的集中管理和可视化结果的便捷分享...\n*   可定制化与可扩展性：模块化的设计使得平台未来可以根据新的科研需求，方便地添加新的分析模块...\n*   客户评价："Hot团队开发的这个可视化平台对我们的科研工作起到了革命性的推动作用！..."`;
            return "案例内容加载失败。"; // Fallback
        } catch (error) {
            console.error("Error fetching case study content:", error);
            return "案例内容加载失败。";
        }
    }
    
    // Simple Markdown to HTML (basic for bold and paragraphs)
    function simpleMarkdownToHtml(md) {
        let html = md.replace(/\n\n/g, "</p><p>"); // Double newline to paragraph
        html = html.replace(/\n/g, "<br>"); // Single newline to line break
        html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Bold
        html = html.replace(/### (.*?)(<br>|<)/g, "<h4>$1</h4>"); // H3 to H4 for modal
        return "<p>" + html + "</p>";
    }

    const caseDetailsData = {
        case1: { title: "数学建模论文：多目标优化NSGA-II算法详情", image: "images/case_placeholder_1.jpg", contentFile: "content_drafts/case_study_1_description_v2.md" },
        case2: { title: "软著申请：智能图像识别系统详情", image: "images/case_placeholder_2.jpg", contentFile: "content_drafts/case_study_2_description_v2.md" },
        case3: { title: "专利申请：智能生产调度系统详情", image: "images/case_placeholder_3.jpg", contentFile: "content_drafts/case_study_3_description_v2.md" }
    };

    caseDetailTriggers.forEach(trigger => {
        trigger.addEventListener("click", async function(event) {
            event.preventDefault();
            if (!caseModal || !modalCaseTitle || !modalCaseImage || !modalCaseDescription) return;
            const caseId = this.closest(".case-study-item").dataset.caseId;
            const data = caseDetailsData[caseId];
            if (data) {
                modalCaseTitle.textContent = data.title;
                modalCaseImage.src = data.image;
                modalCaseImage.alt = data.title + " 详情图片";
                // Fetch and set description from MD file (simulated)
                const markdownContent = await fetchMarkdownContent(data.contentFile);
                modalCaseDescription.innerHTML = simpleMarkdownToHtml(markdownContent);
                caseModal.style.display = "block";
                document.body.style.overflow = "hidden"; // Prevent background scroll when modal is open
            }
        });
    });

    // 为数学建模论文卡片添加点击事件
    document.querySelectorAll(".paper-card").forEach(paperCard => {
        paperCard.addEventListener("click", function() {
            if (!caseModal || !modalCaseTitle || !modalCaseImage || !modalCaseDescription) return;
            
            // 获取论文标题和图片
            const paperTitle = this.querySelector(".paper-title").textContent;
            const paperImage = this.querySelector(".paper-image").src;
            const paperAward = this.querySelector(".paper-award").textContent;
            
            // 设置模态框内容
            modalCaseTitle.textContent = paperTitle;
            modalCaseImage.src = paperImage;
            modalCaseImage.alt = paperTitle + " 详情图片";
            
            // 生成详情内容
            let paperDetail = `
                <p><strong>获奖情况：</strong>${paperAward}</p>
                <h4>论文简介</h4>
                <p>该论文是我们团队协助客户完成的高质量数学建模成果，通过精心设计的算法和模型，解决了实际应用场景中的复杂问题。</p>
                <h4>技术方法</h4>
                <p>针对具体问题，我们采用了高效的数学建模方法，结合优化算法、机器学习等先进技术，构建了一套完整的解决方案。包括数据处理、模型构建、算法设计、参数调优、结果分析和论文撰写等全流程服务。</p>
                <h4>应用价值</h4>
                <p>该模型不仅具有理论创新性，还具有很强的实用价值，可广泛应用于相关领域的决策支持、流程优化和系统改进。我们的服务帮助客户在竞赛中取得了优异成绩，充分展示了我们团队的专业能力。</p>
                <h4>服务流程</h4>
                <p>我们提供从需求分析、建模设计到论文撰写的全流程专业服务，确保每一步都符合客户需求和竞赛标准。如需了解更多细节或有类似需求，欢迎联系我们的客服。</p>
            `;
            
            modalCaseDescription.innerHTML = paperDetail;
            caseModal.style.display = "block";
            document.body.style.overflow = "hidden"; // Prevent background scroll when modal is open
        });
    });

    function closeCaseModal() {
        if (!caseModal) return;
        caseModal.style.display = "none";
        document.body.style.overflow = "auto"; // Restore background scroll
    }

    if (closeModalButton) closeModalButton.addEventListener("click", closeCaseModal);
    if (caseModal) window.addEventListener("click", (event) => { if (event.target === caseModal) closeCaseModal(); });
    window.addEventListener("keydown", (event) => { if (event.key === "Escape" && caseModal && caseModal.style.display === "block") closeCaseModal(); });


    // --- FAQ Accordion Logic ---
    // This simple FAQ functionality has been replaced by the enhanced initFAQSection()
    // at the bottom of this file, which adds search and filtering capabilities.

    // --- Booking Form Logic ---
    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
        bookingForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const responseEl = document.getElementById("booking-response");
            responseEl.textContent = "正在提交您的预约请求...";
            responseEl.style.color = "#79e1ff"; // Updated color
            // Simulate submission
            setTimeout(() => {
                const nameInput = document.getElementById("booking-name");
                responseEl.textContent = `感谢您的预约，${nameInput ? nameInput.value.trim() : "贵客"}！我们会尽快与您联系。`;
                bookingForm.reset();
            }, 1500);
        });
    }

    // --- Chat Widget Enhanced Logic ---
    const chatToggle = document.getElementById("chat-toggle");
    const chatWidget = document.getElementById("chat-widget");
    const closeChat = document.getElementById("close-chat");
    const chatMessagesContainer = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const sendChat = document.getElementById("send-chat-btn");
    const clearChatHistoryBtn = document.getElementById("clear-chat-history");
    const quickQuestionsArea = document.getElementById("quick-questions");
    const chatResizeHandle = document.getElementById("chat-resize-handle");
    const modelSelect = document.getElementById("model-select");
    
    // Simplified chat widget functionality
    let chatHistory = [];
    let isTypingResponse = false;
    
    // Initialize model selection UI
    function initializeModelSelection() {
        if (modelSelect) {
            // Get the parent container
            const chatHeader = document.querySelector(".chat-header");
            if (!chatHeader) return;
            
            // Create a fully custom dropdown instead of using the native select
            // First create a container for our custom dropdown
            const customDropdown = document.createElement("div");
            customDropdown.className = "custom-dropdown";
            customDropdown.style.position = "relative";
            customDropdown.style.marginLeft = "auto";
            customDropdown.style.zIndex = "100";
            
            // Create the selected item display
            const selectedDisplay = document.createElement("div");
            selectedDisplay.className = "selected-model";
            selectedDisplay.textContent = getModelDisplayName(currentModel);
            selectedDisplay.style.backgroundColor = "#1e1e2e";
            selectedDisplay.style.color = "#ffffff";
            selectedDisplay.style.padding = "5px 28px 5px 10px";
            selectedDisplay.style.borderRadius = "4px";
            selectedDisplay.style.border = "1px solid #3a3a5a";
            selectedDisplay.style.cursor = "pointer";
            selectedDisplay.style.width = "120px";
            selectedDisplay.style.position = "relative";
            selectedDisplay.style.fontSize = "14px";
            selectedDisplay.style.fontWeight = "500";
            
            // Add dropdown arrow
            selectedDisplay.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2379e1ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")";
            selectedDisplay.style.backgroundRepeat = "no-repeat";
            selectedDisplay.style.backgroundPosition = "right 8px center";
            
            // Create the options container (hidden initially)
            const optionsContainer = document.createElement("div");
            optionsContainer.className = "model-options";
            optionsContainer.style.display = "none";
            optionsContainer.style.position = "absolute";
            optionsContainer.style.top = "100%";
            optionsContainer.style.left = "0";
            optionsContainer.style.right = "0";
            optionsContainer.style.backgroundColor = "#1e1e2e";
            optionsContainer.style.border = "1px solid #3a3a5a";
            optionsContainer.style.borderRadius = "4px";
            optionsContainer.style.marginTop = "4px";
            optionsContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            optionsContainer.style.zIndex = "101";
            
            // Add options
            const models = [
                { value: "doubao", label: "豆包" },
                { value: "hot", label: "Hot" },
                { value: "deepseek", label: "DeepSeek" }
            ];
            
            models.forEach(model => {
                const option = document.createElement("div");
                option.className = "model-option";
                option.dataset.value = model.value;
                option.textContent = model.label;
                option.style.padding = "8px 10px";
                option.style.cursor = "pointer";
                option.style.color = "#ffffff";
                
                // Style the currently selected option
                if (model.value === currentModel) {
                    option.style.backgroundColor = "#3a3a5a";
                    option.style.color = "#79e1ff";
                }
                
                // Add hover effect
                option.addEventListener("mouseover", function() {
                    if (model.value !== currentModel) {
                        this.style.backgroundColor = "#2a2a3a";
                    }
                });
                
                option.addEventListener("mouseout", function() {
                    if (model.value !== currentModel) {
                        this.style.backgroundColor = "";
                    }
                });
                
                // Add click event
                option.addEventListener("click", function() {
                    const newModel = this.dataset.value;
                    if (newModel !== currentModel) {
                        // Update the model
                        currentModel = newModel;
                        
                        // Update selected display
                        selectedDisplay.textContent = getModelDisplayName(currentModel);
                        
                        // Update options styling
                        const allOptions = optionsContainer.querySelectorAll(".model-option");
                        allOptions.forEach(opt => {
                            if (opt.dataset.value === currentModel) {
                                opt.style.backgroundColor = "#3a3a5a";
                                opt.style.color = "#79e1ff";
                            } else {
                                opt.style.backgroundColor = "";
                                opt.style.color = "#ffffff";
                            }
                        });
                        
                        // Update the badge
                        updateModelBadge();
                        
                        // Initialize the client for the new model
                        initializeOpenAIClient();
                        
                            // Add system message about model change
    const modelChangeMessage = `Hot：已切换至 ${getModelDisplayName(currentModel)} 模型`;
                        addMessageToChatDOM(modelChangeMessage, "bot", null, true);
                        
                        console.log(`Model changed to: ${currentModel}`);
                    }
                    
                    // Hide options after selection
                    optionsContainer.style.display = "none";
                });
                
                optionsContainer.appendChild(option);
            });
            
            // Toggle options display on click
            selectedDisplay.addEventListener("click", function() {
                if (optionsContainer.style.display === "none") {
                    optionsContainer.style.display = "block";
                } else {
                    optionsContainer.style.display = "none";
                }
            });
            
            // Hide options when clicking elsewhere
            document.addEventListener("click", function(event) {
                if (!customDropdown.contains(event.target)) {
                    optionsContainer.style.display = "none";
                }
            });
            
            // Add everything to the dropdown container
            customDropdown.appendChild(selectedDisplay);
            customDropdown.appendChild(optionsContainer);
            
            // Add the custom dropdown to the header
            chatHeader.appendChild(customDropdown);
            
            // Hide the original select
            modelSelect.style.display = "none";
            
            // Update model badge function
            function updateModelBadge() {
                // First check if badge already exists and remove it if so
                const existingBadge = document.getElementById("model-badge");
                if (existingBadge) {
                    existingBadge.remove();
                }
                
                const chatHeaderTitle = document.querySelector(".chat-header h3");
                if (chatHeaderTitle) {
                    const modelBadge = document.createElement("span");
                    modelBadge.id = "model-badge";
                    modelBadge.className = `model-badge ${currentModel}`;
                    modelBadge.innerHTML = `<span class="model-badge-dot"></span>${getModelDisplayName(currentModel)}`;
                    chatHeaderTitle.appendChild(modelBadge);
                }
            }
            
            // Initialize the badge
            updateModelBadge();
        }
    }
    
    // Helper function to get display name for models
    function getModelDisplayName(modelKey) {
        const modelNames = {
            "doubao": "豆包",
            "hot": "Hot",
            "deepseek": "DeepSeek"
        };
        return modelNames[modelKey] || modelKey;
    }

    // Toggle chat widget visibility with smooth animation
    if (chatToggle) {
        chatToggle.addEventListener("click", function() {
            if (!chatWidget) return;
            
            if (chatWidget.style.display === "none") {
                chatWidget.style.display = "flex";
                chatWidget.style.opacity = "0";
                chatWidget.style.transform = "translateY(20px) scale(0.95)";
                
                // Trigger reflow
                void chatWidget.offsetWidth;
                
                chatWidget.style.opacity = "1";
                chatWidget.style.transform = "translateY(0) scale(1)";
                
                if (chatInput) {
                    setTimeout(() => chatInput.focus(), 300);
                }
            } else {
                chatWidget.style.opacity = "0";
                chatWidget.style.transform = "translateY(20px) scale(0.95)";
                
                setTimeout(() => {
                    chatWidget.style.display = "none";
                }, 300);
            }
        });
    }
    
    // Close chat widget with animation
    if (closeChat) {
        closeChat.addEventListener("click", function() {
            if (!chatWidget) return;
            
            chatWidget.style.opacity = "0";
            chatWidget.style.transform = "translateY(20px) scale(0.95)";
            
            setTimeout(() => {
                chatWidget.style.display = "none";
                chatWidget.style.transform = "";
            }, 300);
        });
    }
    
    // Load chat history from localStorage
    function loadChatHistory() {
        const saved = localStorage.getItem(CHAT_HISTORY_KEY);
        if (saved) {
            try {
                chatHistory = JSON.parse(saved);
                // Display loaded messages
                if (chatHistory.length > 0) {
                    // Clear default message if we have history
                    if (chatMessagesContainer) {
                        chatMessagesContainer.innerHTML = "";
                    }
                    
                chatHistory.forEach(msg => {
                        addMessageToChatDOM(msg.content, msg.sender, msg.timestamp);
                });
                }
                
                // Scroll to bottom
                scrollChatToBottom();
                
            } catch (error) {
                console.error("Error loading chat history:", error);
                chatHistory = [];
            }
        }
    }
    
    // Save chat history to localStorage
    function saveChatHistory() {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
    }
    
    // Updated getAIResponse function to call real AI models
    async function getAIResponse(userMessage) {
        // Show typing indicator immediately
        let typingIndicator = document.createElement("div");
        typingIndicator.className = "typing-indicator";
        typingIndicator.innerHTML = `
            <div class="typing-dots">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        if (chatMessagesContainer) {
            chatMessagesContainer.appendChild(typingIndicator);
            scrollChatToBottom();
        }
        
        isTypingResponse = true;
        
        try {
            // Get model display name
            const modelDisplayName = getModelDisplayName(currentModel);
            let botResponse = "";
            
            // Get recent conversation history for context - last 4 exchanges
            const recentHistory = chatHistory.slice(-8);
            const contextMessages = recentHistory.map(msg => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.content.replace(/<[^>]*>/g, '') // Remove HTML tags from content
            }));
            
            // Create system prompt with business info - emphasizing natural responses
            const systemPrompt = {
                role: "system", 
                content: "你是Hot科技创新服务平台的Hot助手，你的职责是解答用户关于平台服务的问题以及其他类型的问题。平台提供的服务包括：数学建模代写（思路+图+代码：¥65，完整论文+图+代码：¥185，完全代写：¥500）、数学建模辅导、软著申请（220元/件）、专利撰写、作业服务和项目定制等。联系方式是微信号：yusan53001（推荐）、项目交付周期一般为：简单建模项目1-3天、标准建模项目3-7天、复杂定制项目7-15天。团队创始人是惠文清。必须注意：你的回答必须是完全自然的人类对话风格，无论什么情况都绝对禁止使用'-'、'*'、'#'或任何其他符号来制作列表。请使用流畅的自然语言，像人类客服一样表达，用句子描述而非标点制作列表。保持专业友好的态度，回答要简洁明了。这是最重要的要求：你的回复必须100%像人类而非AI，不要有任何机器人式的格式化文本。你可以回答与平台服务无关的普通问题，但优先提供与平台相关的信息。你的名字是Hot，不是智能助手或其他名称。"
            };
            
            // Add all messages with system prompt first
            const messages = [systemPrompt, ...contextMessages, {role: "user", content: userMessage}];
            
            // Set up API parameters based on selected model
            let apiUrl, apiKey, modelName, headers;
            
            switch(currentModel) {
                case "doubao":
                    apiUrl = DOUBAO_API_URL;
                    apiKey = DOUBAO_API_KEY;
                    modelName = "doubao-1.5-pro-32k-250115";
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    };
                    break;
                    
                case "deepseek":
                    apiUrl = DEEPSEEK_API_URL;
                    apiKey = DEEPSEEK_API_KEY;
                    modelName = "deepseek-chat";
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    };
                    break;
                    
                case "tongyi":
                    apiUrl = TONGYI_API_URL;
                    apiKey = TONGYI_API_KEY;
                    modelName = "qwen-plus";
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    };
                    break;
                    
                case "hot":
                    apiUrl = HOT_API_URL;
                    apiKey = HOT_API_KEY;
                    modelName = "qwen-plus";
                    headers = {
                        "Content-Type": "application/json", 
                        "Authorization": `Bearer ${apiKey}`
                    };
                    break;
                    
                default:
                    // Fallback to Doubao
                    apiUrl = DOUBAO_API_URL;
                    apiKey = DOUBAO_API_KEY;
                    modelName = "doubao-1.5-pro-32k-250115";
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    };
            }
            
            // Call API with appropriate parameters
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
            
            try {
                // Prepare the request body based on the selected model
                let requestBody = {
                    model: modelName,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 800
                };
                
                // Add model-specific parameters
                if (currentModel === "hot" || currentModel === "tongyi") {
                    // Hot和通义千问使用相同的百炼API
                    console.log("使用百炼API，模型名称:", modelName);
                }
                
                // For debugging
                console.log(`发送API请求到 ${apiUrl}`);
                console.log("请求头:", headers);
                console.log("请求体:", JSON.stringify(requestBody, null, 2));
                
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    let errorText = '';
                    try {
                        errorText = await response.text();
                        console.error(`API错误: ${response.status}`, errorText);
                    } catch (e) {
                        console.error(`无法读取错误详情: ${e}`);
                    }
                    throw new Error(`API错误: ${response.status}`);
                }
                
                // Parse standard JSON response
                let data;
                try {
                    data = await response.json();
                    console.log("API响应:", data); // 添加调试信息
                } catch (e) {
                    console.error("解析JSON错误:", e);
                    throw new Error("解析API响应失败");
                }
                
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    botResponse = data.choices[0].message.content;
                } else {
                    console.error("API返回格式错误:", data);
                    throw new Error("API返回格式错误");
                }
            } catch (error) {
                clearTimeout(timeoutId);
                throw error; // Re-throw to be caught by the outer try/catch
            }
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                typingIndicator.parentNode.removeChild(typingIndicator);
            }
            
            // Add model badge to response
            botResponse = `<span class="model-badge ${currentModel}"><span class="model-badge-dot"></span>${modelDisplayName}</span> ${botResponse}`;
            
            // Add the bot response to chat
            addMessageToChatDOM(botResponse, "bot", null, true);
        } catch (error) {
            console.error("Error getting AI response:", error);
            
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                typingIndicator.parentNode.removeChild(typingIndicator);
            }
            
            // Add error message with fallback to simulateModelResponse
            try {
                const fallbackResponse = await simulateModelResponse(userMessage);
                const modelDisplayName = getModelDisplayName(currentModel);
                const errorMessage = `<span class="model-badge ${currentModel}"><span class="model-badge-dot"></span>${modelDisplayName}</span> ${fallbackResponse}`;
                addMessageToChatDOM(errorMessage, "bot", null, true);
            } catch (fallbackError) {
                // If even the fallback fails, show generic error
                const modelDisplayName = getModelDisplayName(currentModel);
                const errorMessage = `<span class="model-badge ${currentModel}"><span class="model-badge-dot"></span>Error</span> 抱歉，我是Hot，但当前连接出现问题。我们提供数学建模代写、软著申请等服务，您可以通过微信(yusan53001)联系我们获取详细信息。`;
                addMessageToChatDOM(errorMessage, "bot", null, true);
            }
        }
        
        isTypingResponse = false;
    }
    
    // Handle sending a message
    function sendMessage() {
        if (!chatInput || !chatInput.value.trim() || isTypingResponse) return;
        
        const userMessage = chatInput.value.trim();
        chatInput.value = "";
        
        // Add user message to chat
        addMessageToChatDOM(userMessage, "user", null, true);
        
        // Get AI response based on user message
        getAIResponse(userMessage);
    }

    // Add a message to the DOM with more reliable typing indicators
    function addMessageToChatDOM(message, sender, timestamp = null, shouldSave = false, withTypingAnimation = false) {
        if (!chatMessagesContainer) return;
        
        const messageTimestamp = timestamp || getCurrentTime();
        const messageDiv = document.createElement("div");
        messageDiv.className = `chat-message ${sender}-message`;
        
        // Handle message content
        messageDiv.innerHTML = `
            <div class="message-content">
                ${message}
                <span class="message-timestamp">${messageTimestamp}</span>
            </div>
        `;
        
        chatMessagesContainer.appendChild(messageDiv);
        scrollChatToBottom();
        
        // Save to history if needed
        if (shouldSave) {
            chatHistory.push({
                content: message,
                sender: sender,
                timestamp: messageTimestamp
            });
            saveChatHistory();
        }
    }
    
    // Get current time in HH:MM format
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Scroll chat to bottom
    function scrollChatToBottom() {
        if (chatMessagesContainer) {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
    }
    
    // Enter key press in input
    if (chatInput) {
        chatInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Send button click
    if (sendChat) {
        sendChat.addEventListener("click", function() {
            sendMessage();
        });
    }
    
    // Quick questions
    if (quickQuestionsArea) {
        const quickQuestionBtns = quickQuestionsArea.querySelectorAll(".quick-question-btn");
        quickQuestionBtns.forEach(btn => {
            btn.addEventListener("click", function() {
                if (chatInput) {
                    chatInput.value = this.textContent;
                    sendMessage();
                }
            });
        });
    }
    
    // Clear chat history
    if (clearChatHistoryBtn) {
        clearChatHistoryBtn.addEventListener("click", function() {
            if (chatMessagesContainer) {
                chatMessagesContainer.innerHTML = "";
                chatHistory = [];
                saveChatHistory();
                addMessageToChatDOM("聊天记录已清除。我是Hot，有什么可以帮您的吗？", "bot", null, true);
            }
        });
    }
    
    // Initialize chat
    if (chatWidget) {
        loadChatHistory();
        initializeModelSelection();
        
        // Update chat header title to "Hot"
        const chatHeaderTitle = document.querySelector(".chat-header h3");
        if (chatHeaderTitle) {
            // If there's text content directly in the h3 (not in child elements)
            const textNodes = Array.from(chatHeaderTitle.childNodes).filter(node => node.nodeType === 3);
            if (textNodes.length > 0) {
                // Replace "智能助手" with "Hot" if it exists
                for (let node of textNodes) {
                    if (node.textContent.includes("智能助手")) {
                        node.textContent = node.textContent.replace("智能助手", "Hot");
                    }
                }
            }
        }
        
        // Add styles for the new model badges and resizable input
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            /* Chat header styling */
            .chat-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 15px;
            }
            
            .chat-header h3 {
                margin: 0;
                display: flex;
                align-items: center;
                font-size: 16px;
            }
            
            /* Model badge styles */
            .model-badge {
                display: inline-flex;
                align-items: center;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: bold;
                margin-right: 8px;
                margin-left: 8px;
                opacity: 0.85;
            }
            
            .model-badge-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 4px;
            }
            
            /* Individual model styling */
            .model-badge.doubao {
                background-color: rgba(121, 225, 255, 0.25);
                color: #0099cc;
            }
            .model-badge.doubao .model-badge-dot {
                background-color: #0099cc;
            }
            
            .model-badge.hot {
                background-color: rgba(255, 61, 113, 0.25);
                color: #e91e63;
            }
            .model-badge.hot .model-badge-dot {
                background-color: #e91e63;
            }
            
            .model-badge.deepseek {
                background-color: rgba(29, 185, 84, 0.25);
                color: #1db954;
            }
            .model-badge.deepseek .model-badge-dot {
                background-color: #1db954;
            }
            
            /* Model select dropdown styling */
            #model-select {
                background-color: #1e1e2e;
                color: #ffffff;
                border: 1px solid #3a3a5a;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2379e1ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 8px center;
                padding-right: 28px;
                margin-left: auto;
            }
            
            #model-select:focus {
                outline: none;
                border-color: #79e1ff;
                box-shadow: 0 0 0 2px rgba(121, 225, 255, 0.25);
            }
            
            #model-select option {
                background-color: #1e1e2e;
                color: #ffffff;
                padding: 8px;
            }
            
            #model-select option:checked,
            #model-select option:hover,
            #model-select option:focus {
                background-color: #3a3a5a !important;
                color: #79e1ff !important;
            }
            
            /* Force custom styling for selected option by adding a class */
            .model-option-selected {
                background-color: #3a3a5a !important;
                color: #79e1ff !important;
            }
            
            /* Resizable chat input area */
            .chat-input-container {
                position: relative;
                padding: 10px;
                border-top: 1px solid #3a3a5a;
            }
            
            .chat-input-resize-handle {
                position: absolute;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 6px;
                background-color: #3a3a5a;
                border-radius: 3px;
                cursor: ns-resize;
                z-index: 10;
                opacity: 0.7;
                transition: opacity 0.2s, background-color 0.2s;
            }
            
            .chat-input-resize-handle:hover {
                opacity: 1;
                background-color: #79e1ff;
            }
            
            #chat-input {
                min-height: 40px;
                max-height: 200px;
                resize: none;
                transition: height 0.2s ease;
            }
        `;
        document.head.appendChild(styleEl);
        
        // Make chat input resizable
        setupResizableChatInput();
    }

    // Add resizable functionality to chat input
    function setupResizableChatInput() {
        const chatInput = document.getElementById("chat-input");
        let chatInputContainer = document.querySelector(".chat-input-container");
        
        // If the chat-input-container doesn't exist, we need to create or identify it
        if (!chatInputContainer && chatInput) {
            // Check if the parent already has some container-like structure
            const possibleContainer = chatInput.closest(".chat-footer") || chatInput.parentElement;
            
            if (possibleContainer) {
                // Add the class to the existing parent
                possibleContainer.classList.add("chat-input-container");
                chatInputContainer = possibleContainer;
            } else {
                // Create a new container and wrap the input
                chatInputContainer = document.createElement("div");
                chatInputContainer.className = "chat-input-container";
                chatInput.parentNode.insertBefore(chatInputContainer, chatInput);
                chatInputContainer.appendChild(chatInput);
            }
        }
        
        if (!chatInput || !chatInputContainer) return;
        
        // Create resize handle
        const resizeHandle = document.createElement("div");
        resizeHandle.className = "chat-input-resize-handle";
        chatInputContainer.insertBefore(resizeHandle, chatInputContainer.firstChild);
        
        // Variables for tracking resize state
        let isResizing = false;
        let startY = 0;
        let startHeight = 0;
        
        // Set initial height (if not already set)
        if (!chatInput.style.height || chatInput.style.height === "auto") {
            chatInput.style.height = "40px";
        }
        
        // Add event listeners for resize handle
        resizeHandle.addEventListener("mousedown", function(e) {
            isResizing = true;
            startY = e.clientY;
            startHeight = parseInt(window.getComputedStyle(chatInput).height, 10);
            
            document.addEventListener("mousemove", handleResize);
            document.addEventListener("mouseup", stopResize);
            
            // Add active state class
            this.style.opacity = "1";
            this.style.backgroundColor = "#79e1ff";
            
            e.preventDefault();
        });
        
        // Handle resize during mouse movement
        function handleResize(e) {
            if (!isResizing) return;
            
            // Calculate the new height based on mouse movement (going up = increasing height)
            const deltaY = startY - e.clientY;
            const newHeight = Math.max(40, Math.min(200, startHeight + deltaY));
            
            // Apply the new height
            chatInput.style.height = newHeight + "px";
            
            // Scroll chat to bottom when resizing to ensure it stays in view
            const chatMessagesContainer = document.getElementById("chat-messages");
            if (chatMessagesContainer) {
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            }
        }
        
        // Stop resizing on mouse up
        function stopResize() {
            isResizing = false;
            document.removeEventListener("mousemove", handleResize);
            document.removeEventListener("mouseup", stopResize);
            
            // Remove active state
            resizeHandle.style.opacity = "0.7";
            resizeHandle.style.backgroundColor = "#3a3a5a";
        }
        
        // Log that resizable chat input was set up
        console.log("Resizable chat input initialized");
    }

    // --- Draggable and Resizable Chat Widget ---
    if (chatWidget && chatResizeHandle) {
        // Variable declarations for resize
        let isResizingWidget = false;
        let initialHeight, initialMouseY;
        
        // Chat resize handle functionality
        chatResizeHandle.addEventListener("mousedown", (e) => {
            isResizingWidget = true; 
            document.body.style.userSelect = "none"; // Prevent text selection during resize

            initialHeight = chatWidget.offsetHeight;
            initialMouseY = e.clientY;
            
            document.addEventListener("mousemove", onWidgetResize, { passive: false });
            document.addEventListener("mouseup", onWidgetResizeEnd);
            e.preventDefault();
        });

        function onWidgetResize(e) {
            if (!isResizingWidget) return;
            const newHeight = initialHeight + (e.clientY - initialMouseY);
            chatWidget.style.height = Math.max(450, Math.min(newHeight, window.innerHeight * 0.9)) + "px";
            e.preventDefault();
        }
        
        function onWidgetResizeEnd() {
            if (!isResizingWidget) return;
            isResizingWidget = false; 
            document.body.style.userSelect = "auto";
            document.removeEventListener("mousemove", onWidgetResize);
            document.removeEventListener("mouseup", onWidgetResizeEnd);
        }
    }

    // --- Dynamic Clock Logic ---
    // Clock functionality removed
    /*
    const clockContainer = document.getElementById("dynamic-clock-container");
    if (clockContainer) {
        const clockEl = document.createElement("div");
        clockEl.className = "dynamic-clock";
        
        // Create digital clock display only
        clockContainer.appendChild(clockEl);

        function updateClock() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            
            // Display time in HH:MM:SS format
            clockEl.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // Update every second
        setInterval(updateClock, 1000);
        updateClock(); // Initial call
    }
    */

    // --- Initializations ---
    loadChatHistory(); // Load chat history when DOM is ready

    // Remove redundant initialization - we already activate first section in nav code
    // if (navLinks.length > 0) {
    //     navLinks[0].click(); // Simulate click to ensure active state and animation
    // }

    // Initialize variables for chat resize handle
    let isResizingChat = false;
    let initialChatHeight, initialMouseY;

    // Add resize handle to chat widget
    function addChatResizeHandle() {
        if (!chatWidget) return;
        
        // Add resize handle if it doesn't exist
        let resizeHandle = document.getElementById("chat-resize-handle");
        if (!resizeHandle) {
            resizeHandle = document.createElement("div");
            resizeHandle.id = "chat-resize-handle";
            resizeHandle.innerHTML = '<div class="resize-indicator"></div>';
            chatWidget.appendChild(resizeHandle);
        }
        
        // Add resize functionality
        resizeHandle.addEventListener("mousedown", (e) => {
            if (chatWidget.classList.contains("expanded")) return; // Don't resize in expanded mode
            
            isResizingChat = true;
            initialChatHeight = chatWidget.offsetHeight;
            initialMouseY = e.clientY;
            
            document.addEventListener("mousemove", handleChatResize);
            document.addEventListener("mouseup", stopChatResize);
            e.preventDefault();
        });
    }

    // Handle chat resize
    function handleChatResize(e) {
        if (!isResizingChat) return;
        
        const newHeight = initialChatHeight + (e.clientY - initialMouseY);
        chatWidget.style.height = Math.max(350, Math.min(newHeight, window.innerHeight * 0.85)) + "px";
        
        // Ensure chat messages area is scrolled to bottom when resizing
        if (chatMessagesContainer) {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
        
        e.preventDefault();
    }

    // Stop chat resize
    function stopChatResize() {
        isResizingChat = false;
        document.removeEventListener("mousemove", handleChatResize);
        document.removeEventListener("mouseup", stopChatResize);
    }

    // Call this function after DOM is loaded
    document.addEventListener("DOMContentLoaded", () => {
        // Initialize chat widget
        if (chatWidget) {
            addChatResizeHandle();
            
            // Add CSS for resize handle
            const style = document.createElement('style');
            style.textContent = `
                #chat-resize-handle {
                    width: 100%;
                    height: 8px;
                    background-color: transparent;
                    cursor: ns-resize;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                #chat-resize-handle .resize-indicator {
                    width: 40px;
                    height: 4px;
                    background-color: #3a3a5a;
                    border-radius: 2px;
                    opacity: 0.7;
                    transition: opacity 0.2s ease;
                }
                
                #chat-resize-handle:hover .resize-indicator {
                    opacity: 1;
                    background-color: #61dafb;
                }
                
                #chat-widget.expanded #chat-resize-handle {
                    display: none;
                }
            `;
            document.head.appendChild(style);
        }
    });

    // 添加新功能：语音输入、消息朗读、表情解析等
    function enhanceChatExperience() {
        // 1. 添加语音输入按钮
        const chatInputArea = document.querySelector('.chat-input-area');
        const voiceInputBtn = document.createElement('button');
        voiceInputBtn.className = 'voice-input-btn';
        voiceInputBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>';
        voiceInputBtn.title = '语音输入';
        
        // 在输入框前插入语音输入按钮
        chatInputArea.insertBefore(voiceInputBtn, document.getElementById('chat-input'));

        // 2. 添加语音朗读按钮
        const readAloudBtn = document.createElement('button');
        readAloudBtn.className = 'read-aloud-btn';
        readAloudBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';
        readAloudBtn.title = '朗读消息';
        
        // 在发送按钮前插入朗读按钮
        chatInputArea.insertBefore(readAloudBtn, document.getElementById('send-chat-btn'));

        // 3. 添加清除输入按钮
        const clearInputBtn = document.createElement('button');
        clearInputBtn.className = 'clear-input-btn';
        clearInputBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        clearInputBtn.title = '清除输入';
        clearInputBtn.style.display = 'none'; // 默认隐藏
        
        // 在输入框后插入清除按钮
        document.getElementById('chat-input').insertAdjacentElement('afterend', clearInputBtn);

        // 4. 实现语音输入功能
        voiceInputBtn.addEventListener('click', startVoiceRecognition);

        // 5. 实现朗读功能
        readAloudBtn.addEventListener('click', readLastBotMessage);
        
        // 6. 实现清除输入功能
        clearInputBtn.addEventListener('click', () => {
            document.getElementById('chat-input').value = '';
            clearInputBtn.style.display = 'none';
        });
        
        // 7. 监听输入变化，显示或隐藏清除按钮
        document.getElementById('chat-input').addEventListener('input', () => {
            clearInputBtn.style.display = document.getElementById('chat-input').value.trim() ? 'flex' : 'none';
        });
    }

    // 语音识别功能
    function startVoiceRecognition() {
        const voiceInputBtn = document.querySelector('.voice-input-btn');
        const chatInput = document.getElementById('chat-input');
        
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('您的浏览器不支持语音识别功能');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.interimResults = true;
        
        // 改变按钮样式，表示正在录音
        voiceInputBtn.classList.add('recording');
        
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            
            chatInput.value = transcript;
            // 触发输入事件以显示清除按钮
            chatInput.dispatchEvent(new Event('input'));
        };
        
        recognition.onend = () => {
            voiceInputBtn.classList.remove('recording');
        };
        
        recognition.onerror = (event) => {
            console.error('语音识别错误:', event.error);
            voiceInputBtn.classList.remove('recording');
        };
        
        recognition.start();
    }

    // 语音朗读功能
    function readLastBotMessage() {
        const readAloudBtn = document.querySelector('.read-aloud-btn');
        const botMessages = document.querySelectorAll('.bot-message .message-content');
        
        if (botMessages.length === 0) return;
        
        // 获取最后一条机器人消息
        const lastBotMessage = botMessages[botMessages.length - 1];
        const messageText = lastBotMessage.textContent.replace(/刚刚|几秒前|\d+分钟前/g, '').trim();
        
        if (!messageText) return;
        
        // 检查浏览器是否支持语音合成
        if (!('speechSynthesis' in window)) {
            alert('您的浏览器不支持语音合成功能');
            return;
        }
        
        // 停止任何正在进行的语音
        window.speechSynthesis.cancel();
        
        // 创建语音合成实例
        const utterance = new SpeechSynthesisUtterance(messageText);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        // 高亮显示正在朗读的消息
        lastBotMessage.classList.add('reading');
        readAloudBtn.classList.add('reading');
        
        utterance.onend = () => {
            lastBotMessage.classList.remove('reading');
            readAloudBtn.classList.remove('reading');
        };
        
        // 开始朗读
        window.speechSynthesis.speak(utterance);
    }

    // 添加emoji表情解析功能
    function parseEmoji(text) {
        // 基本表情映射
        const emojiMap = {
            ':)': '😊', ':-)': '😊', ':D': '😃', ':-D': '😃',
            ':(': '😞', ':-(': '😞', ';)': '😉', ';-)': '😉',
            ':p': '😛', ':-p': '😛', ':P': '😛', ':-P': '😛',
            ':o': '😮', ':-o': '😮', ':O': '😮', ':-O': '😮',
            '<3': '❤️', '</3': '💔',
            ':+1:': '👍', ':-1:': '👎',
            ':laugh:': '🤣', ':smile:': '😊', ':sad:': '😔',
            ':cry:': '😢', ':think:': '🤔', ':cool:': '😎',
            ':ok:': '👌', ':fire:': '🔥', ':star:': '⭐',
            ':wave:': '👋', ':hug:': '🤗', ':eyes:': '👀'
        };
        
        // 替换表情符号
        Object.keys(emojiMap).forEach(key => {
            const regex = new RegExp(key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g');
            text = text.replace(regex, emojiMap[key]);
        });
        
        return text;
    }

    // 智能分段处理消息
    function formatMessageWithParagraphs(message) {
        if (!message || typeof message !== 'string') return message;
        
        // 分割长句，保持每个段落有合适的长度
        const sentences = message.split(/(?<=[。！？.!?])\s*/);
        let paragraphs = [];
        let currentParagraph = '';
        
        sentences.forEach(sentence => {
            // 如果当前段落加上这个句子超过一定长度，就开始新段落
            if (currentParagraph && (currentParagraph.length + sentence.length > 100)) {
                paragraphs.push(currentParagraph);
                currentParagraph = sentence;
            } else {
                currentParagraph += sentence;
            }
            
            // 如果是空行或明显的段落分隔符，创建新段落
            if (sentence.match(/\n\s*\n/) || sentence.trim() === '') {
                if (currentParagraph.trim() !== '') {
                    paragraphs.push(currentParagraph);
                    currentParagraph = '';
                }
            }
        });
        
        // 添加最后一个段落
        if (currentParagraph.trim() !== '') {
            paragraphs.push(currentParagraph);
        }
        
        // 将段落合并为HTML
        return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
    }

    // 修改原有的addMessage函数，使用新功能
    function addMessage(role, content, timestamp = '刚刚', addToHistory = true, modelType = null) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        
        // 应用Emoji解析
        content = parseEmoji(content);
        
        // 应用段落格式化
        const formattedContent = formatMessageWithParagraphs(content);
        
        messageDiv.className = `chat-message ${role === 'user' ? 'user-message' : 'bot-message'}`;
        
        let messageContent = `
            <div class="message-content">
                ${formattedContent || content}
                <span class="message-timestamp">${timestamp}</span>
            </div>
        `;
        
        // 如果是机器人消息且有模型类型，添加模型标记
        if (role === 'bot' && modelType) {
            messageContent = `
                <div class="message-content">
                    ${formattedContent || content}
                    <span class="message-timestamp">${timestamp}</span>
                    <span class="model-badge ${modelType}">
                        <span class="model-badge-dot"></span>${getModelDisplayName(modelType)}
                    </span>
                </div>
            `;
        }
        
        messageDiv.innerHTML = messageContent;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // 如果需要，将消息添加到历史记录
        if (addToHistory) {
            chatHistory.push({
                role: role === 'user' ? 'user' : 'assistant',
                content: content
            });
            
            // 保存聊天历史到本地存储
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }
        
        return messageDiv;
    }

    // 初始化增强功能
    enhanceChatExperience();

    // --- Enhanced FAQ Accordion and Search Logic ---
    function initFAQSection() {
        const faqItems = document.querySelectorAll(".faq-item");
        const faqSearch = document.getElementById("faq-search");
        const categoryTabs = document.querySelectorAll(".faq-category-tab");
        const noResultsMessage = document.querySelector(".faq-no-results");
        
        let currentCategory = "all";
        
        // Toggle FAQ items
        faqItems.forEach(item => {
            const question = item.querySelector(".faq-question");
            
            if (question) {
                question.addEventListener("click", (e) => {
                    e.stopPropagation();
                    toggleFAQ(item);
                });
                
                // Make the entire item clickable, not just the question
                item.addEventListener("click", () => {
                    toggleFAQ(item);
                });
                
                // Accessibility: toggle with Enter/Space
                question.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleFAQ(item);
                    }
                });
            }
        });
        
        function toggleFAQ(item) {
            // If the clicked item is already active and another item is being clicked, 
            // we'll leave it open for better UX
            // const isActive = item.classList.contains("active");
            
            // Optional: close other open FAQs
            // if (!isActive) {
            //     faqItems.forEach(otherItem => {
            //         if (otherItem !== item && otherItem.classList.contains("active")) {
            //             otherItem.classList.remove("active");
            //         }
            //     });
            // }
            
            item.classList.toggle("active");
        }
        
        // Filter by category
        if (categoryTabs) {
            categoryTabs.forEach(tab => {
                tab.addEventListener("click", () => {
                    categoryTabs.forEach(t => t.classList.remove("active"));
                    tab.classList.add("active");
                    
                    currentCategory = tab.dataset.category;
                    filterFAQs();
                });
            });
        }
        
        // Search functionality
        if (faqSearch) {
            faqSearch.addEventListener("input", () => {
                filterFAQs();
            });
        }
        
        function filterFAQs() {
            const searchTerm = faqSearch ? faqSearch.value.trim().toLowerCase() : '';
            let visibleCount = 0;
            
            faqItems.forEach(item => {
                const question = item.querySelector(".faq-question").textContent.toLowerCase();
                const answer = item.querySelector(".faq-answer").textContent.toLowerCase();
                const category = item.getAttribute("data-category");
                
                const matchesSearch = searchTerm === '' || 
                                     question.includes(searchTerm) || 
                                     answer.includes(searchTerm);
                                     
                const matchesCategory = currentCategory === "all" || category === currentCategory;
                
                if (matchesSearch && matchesCategory) {
                    item.style.display = "block";
                    visibleCount++;
                    
                    // Highlight search matches in question text
                    if (searchTerm !== '') {
                        highlightText(item.querySelector(".faq-question"), searchTerm);
                    } else {
                        // Remove highlights if search is cleared
                        item.querySelector(".faq-question").innerHTML = 
                            item.querySelector(".faq-question").textContent;
                    }
                } else {
                    item.style.display = "none";
                }
            });
            
            // Show no results message if needed
            if (noResultsMessage) {
                noResultsMessage.style.display = visibleCount === 0 ? "block" : "none";
            }
        }
        
        function highlightText(element, term) {
            const text = element.textContent;
            const highlightedText = text.replace(
                new RegExp(term, 'gi'), 
                match => `<span class="highlight">${match}</span>`
            );
            element.innerHTML = highlightedText;
        }
    }
    
    // Initialize FAQ functionality
    initFAQSection();
});

// Add simulateModelResponse function back for fallback when API isn't available
async function simulateModelResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    const modelDisplayName = getModelDisplayName(currentModel);
    
    if (lowerMessage.includes("创始人") || lowerMessage.includes("老板") || lowerMessage.includes("谁创建") || lowerMessage.includes("谁创办") || lowerMessage.includes("惠文清")) {
        return `我们团队的创始人是惠文清。她创建了Hot科技创新服务平台，致力于为客户提供高质量的技术服务和解决方案。`;
    } else if (lowerMessage.includes("服务") || lowerMessage.includes("提供") || lowerMessage.includes("做什么")) {
        return `我们提供多种服务，包括数学建模代写、数学建模辅导、软著申请、专利撰写、作业服务和项目定制等。您可以在网页首页查看更多详情。`;
    } else if (lowerMessage.includes("数学建模") && (lowerMessage.includes("收费") || lowerMessage.includes("价格") || lowerMessage.includes("费用"))) {
        return `我们的数学建模服务根据需求不同有不同的价格。思路加图加代码是65元，完整论文加图加代码是185元，完全代写是500元。如果您有特殊需求，欢迎与我们沟通。`;
    } else if (lowerMessage.includes("联系") || lowerMessage.includes("微信") || lowerMessage.includes("电话") || lowerMessage.includes("邮箱")) {
        return `您可以通过微信号yusan53001联系我们，这是推荐的联系方式。您也可以发送邮件至contact@hotshop.com，或者直接在网站底部填写预约表单，我们会尽快与您联系。`;
    } else if (lowerMessage.includes("周期") || lowerMessage.includes("多久") || lowerMessage.includes("多长时间")) {
        return `项目交付周期取决于具体需求和项目复杂度。一般来说，简单建模项目需要1-3天，标准建模项目需要3-7天，复杂定制项目需要7-15天。我们也提供加急服务，可根据您的时间要求灵活安排。`;
    } else if (lowerMessage.includes("软著") || lowerMessage.includes("软件著作权")) {
        return `我们的软著申请服务为220元一件，包括全程代办。从提交资料到获得证书一般需要20-30个工作日，我们会负责整个流程，让您无需操心。`;
    } else if (lowerMessage.includes("专利")) {
        return `我们提供专利撰写服务，包括发明专利和实用新型专利。具体价格根据技术领域和复杂度有所不同，建议您直接联系我们进行咨询，以获取最准确的报价。`;
    } else if (lowerMessage.includes("作业") || lowerMessage.includes("代写")) {
        return `我们提供各类编程、数据分析等相关作业的辅助与定制服务。价格根据工作量和难度而定，欢迎详细咨询具体需求，我们会为您提供合理的报价方案。`;
    } else if (lowerMessage.includes("你好") || lowerMessage.includes("您好") || lowerMessage.includes("hi") || lowerMessage.includes("hello")) {
        return `您好！很高兴为您服务。我是Hot，当前使用${modelDisplayName}模型，可以回答您关于我们服务的各种问题以及其他一般性问题。请问有什么可以帮助您的呢？`;
    } else if (lowerMessage.includes("模型") || lowerMessage.includes("切换") || lowerMessage.includes("ai")) {
        return `当前使用的是${modelDisplayName}模型。您可以通过顶部的下拉菜单选择不同的AI模型进行对话，包括豆包、Hot和DeepSeek。`;
    } else if (lowerMessage.includes("天气") || lowerMessage.includes("日期") || lowerMessage.includes("时间")) {
        return `很抱歉，作为Hot，我无法获取实时的天气、日期或时间信息。不过我可以帮您解答关于我们服务的任何疑问，或者与您聊聊其他话题。`;
    } else if (lowerMessage.includes("笑话") || lowerMessage.includes("讲个笑话") || lowerMessage.includes("讲笑话")) {
        return `程序员去咖啡店点咖啡，服务员问他要什么，他说\"要一杯咖啡\"。服务员问\"要加糖吗？\"，程序员回答：\"不，谢谢，我喜欢处理没有警告的错误。\"`;
    } else {
            // 尝试回答更一般的问题
    if (lowerMessage.includes("什么") || lowerMessage.includes("怎么") || lowerMessage.includes("如何") || lowerMessage.includes("为什么") || lowerMessage.length > 10) {
        return `您问了一个很有趣的问题。我可以尽力回答，但可能无法像专业的搜索引擎那样提供全面的信息。如果您有关于我们服务的问题，比如数学建模或者软著申请，我会很乐意为您解答。我们的创始人惠文清一直要求我们提供专业和友好的服务。`;
    }
    return `感谢您的咨询。我很乐意回答您关于Hot科技服务的任何问题。您也可以通过微信yusan53001联系我们的顾问，获取更详细和个性化的解答。惠文清创始人始终强调，良好的客户体验是我们最重要的目标。`;
    }
}

// --- 页面缩放控制器功能 ---
document.addEventListener("DOMContentLoaded", function() {
    // 获取缩放控制器元素
    const zoomController = document.getElementById("zoom-controller");
    const zoomInBtn = document.getElementById("zoom-in");
    const zoomOutBtn = document.getElementById("zoom-out");
    const zoomResetBtn = document.getElementById("zoom-reset");
    const zoomLevelDisplay = document.getElementById("zoom-level");
    const mainContent = document.getElementById("main-content-area");
    
    // 初始化缩放级别
    let currentZoomLevel = 100;
    const minZoom = 50;
    const maxZoom = 200;
    const zoomStep = 10;
    
    // 应用缩放效果
    function applyZoom(zoomLevel) {
        // 限制缩放范围
        currentZoomLevel = Math.min(maxZoom, Math.max(minZoom, zoomLevel));
        
        // 更新显示
        zoomLevelDisplay.textContent = `${currentZoomLevel}%`;
        
        // 应用缩放到内容区域
        mainContent.style.transform = `scale(${currentZoomLevel / 100})`;
        
        // 保存当前缩放级别到本地存储
        localStorage.setItem("hotshop_zoom_level", currentZoomLevel);
    }
    
    // 从本地存储加载缩放级别
    function loadSavedZoom() {
        const savedZoom = localStorage.getItem("hotshop_zoom_level");
        if (savedZoom) {
            applyZoom(parseInt(savedZoom));
        }
    }
    
    // 放大功能
    if (zoomInBtn) {
        zoomInBtn.addEventListener("click", function() {
            applyZoom(currentZoomLevel + zoomStep);
        });
    }
    
    // 缩小功能
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener("click", function() {
            applyZoom(currentZoomLevel - zoomStep);
        });
    }
    
    // 重置功能
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener("click", function() {
            applyZoom(100);
        });
    }
    
    // 键盘快捷键支持
    document.addEventListener("keydown", function(e) {
        // Ctrl + Plus: 放大
        if (e.ctrlKey && (e.key === "+" || e.key === "=")) {
            e.preventDefault();
            applyZoom(currentZoomLevel + zoomStep);
        }
        // Ctrl + Minus: 缩小
        else if (e.ctrlKey && e.key === "-") {
            e.preventDefault();
            applyZoom(currentZoomLevel - zoomStep);
        }
        // Ctrl + 0: 重置
        else if (e.ctrlKey && e.key === "0") {
            e.preventDefault();
            applyZoom(100);
        }
    });
    
    // 应用保存的缩放级别
    loadSavedZoom();
});

// --- Visitor Counter Function ---
function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitor-count');
    const todayCountElement = document.getElementById('today-count');
    const mainVisitorCountElement = document.getElementById('main-visitor-count');
    const mainTodayCountElement = document.getElementById('main-today-count');
    
    // Check if elements exist
    if ((!visitorCountElement && !mainVisitorCountElement) || 
        (!todayCountElement && !mainTodayCountElement)) return;
    
    // Get visitor data from localStorage
    let visitorData = localStorage.getItem('hotshop_visitor_data');
    let todayVisits = 0;
    let totalVisits = 0;
    
    if (visitorData) {
        try {
            const data = JSON.parse(visitorData);
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            
            // Check if we already have data for today
            if (data.lastVisit === today) {
                todayVisits = data.todayVisits + 1;
            } else {
                todayVisits = 1;
            }
            
            totalVisits = data.totalVisits + 1;
            
            // Store updated data
            localStorage.setItem('hotshop_visitor_data', JSON.stringify({
                lastVisit: today,
                todayVisits: todayVisits,
                totalVisits: totalVisits
            }));
        } catch (e) {
            console.error('Error parsing visitor data:', e);
            resetVisitorData();
        }
    } else {
        // First visit, initialize data
        resetVisitorData();
    }
    
    // Format numbers and immediately display them
    const totalVisitsFormatted = totalVisits.toLocaleString();
    const todayVisitsFormatted = todayVisits.toLocaleString();
    
    // Update all counter elements if they exist - with immediate animation
    if (visitorCountElement) {
        visitorCountElement.textContent = totalVisitsFormatted;
        animateCounterValue(visitorCountElement);
    }
    
    if (todayCountElement) {
        todayCountElement.textContent = todayVisitsFormatted;
        animateCounterValue(todayCountElement);
    }
    
    if (mainVisitorCountElement) {
        mainVisitorCountElement.textContent = totalVisitsFormatted;
        animateCounterValue(mainVisitorCountElement);
    }
    
    if (mainTodayCountElement) {
        mainTodayCountElement.textContent = todayVisitsFormatted;
        animateCounterValue(mainTodayCountElement);
    }
    
    // Create a fixed 2-second interval for visitor count to simulate real-time changes
    simulateRealTimeVisits(totalVisits, todayVisits);
    
    function resetVisitorData() {
        const today = new Date().toISOString().split('T')[0];
        // Generate a random base number for more realism
        const randomBase = Math.floor(Math.random() * 5000) + 10000;
        
        localStorage.setItem('hotshop_visitor_data', JSON.stringify({
            lastVisit: today,
            todayVisits: 1,
            totalVisits: randomBase
        }));
        
        todayVisits = 1;
        totalVisits = randomBase;
    }
    
    // Enhanced animation function for counter values
    function animateCounterValue(element) {
        if (!element) return;
        
        // Remove existing animation class
        element.classList.remove('animated');
        
        // Force browser reflow
        void element.offsetWidth;
        
        // Apply custom animation class and effects
        element.classList.add('animated');
        element.style.textShadow = '0 0 15px rgba(255, 61, 113, 0.8)';
        
        // Additional visual effect for more dramatic changes
        if (Math.random() > 0.7) {
            element.style.color = '#ff5588';
            setTimeout(() => {
                element.style.color = '#ff3d71';
            }, 800);
        }
        
        // Reset shadow after animation
        setTimeout(() => {
            element.style.textShadow = '0 0 10px rgba(255, 61, 113, 0.5)';
        }, 800);
    }
    
    function simulateRealTimeVisits(totalCount, todayCount) {
        // Random interval between 6-9 seconds for more natural but still visible updates
        const getRandomInterval = () => Math.floor(Math.random() * 3000) + 6000; // 6000-9000 ms (6-9 seconds)
        
        const incrementVisits = () => {
            // Increment by 1-3 visitors at a time for total count
            const totalIncrement = Math.floor(Math.random() * 3) + 1;
            totalCount += totalIncrement;
            
            // Increment today count with 80% probability of the total increment (increased probability)
            const shouldIncrementToday = Math.random() < 0.8;
            if (shouldIncrementToday) {
                const todayIncrement = Math.ceil(totalIncrement * 0.7); // Increased ratio
                todayCount += todayIncrement;
                
                // Update today's count with animation
                const todayFormatted = todayCount.toLocaleString();
                
                if (todayCountElement) {
                    todayCountElement.textContent = todayFormatted;
                    animateCounterValue(todayCountElement);
                }
                
                if (mainTodayCountElement) {
                    mainTodayCountElement.textContent = todayFormatted;
                    animateCounterValue(mainTodayCountElement);
                }
            }
            
            // Update total count with animation
            const totalFormatted = totalCount.toLocaleString();
            
            if (visitorCountElement) {
                visitorCountElement.textContent = totalFormatted;
                animateCounterValue(visitorCountElement);
            }
            
            if (mainVisitorCountElement) {
                mainVisitorCountElement.textContent = totalFormatted;
                animateCounterValue(mainVisitorCountElement);
            }
            
            // Update localStorage with new values
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem('hotshop_visitor_data', JSON.stringify({
                lastVisit: today,
                todayVisits: todayCount,
                totalVisits: totalCount
            }));
            
            // Schedule next update with variable interval for more natural feeling
            setTimeout(incrementVisits, getRandomInterval());
        };
        
        // Start the simulation immediately with random interval
        setTimeout(incrementVisits, getRandomInterval());
    }
}