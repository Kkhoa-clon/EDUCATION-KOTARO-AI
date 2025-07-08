// JavaScript cho tính năng tạo sơ đồ - Phiên bản đã được clean code
class SoDoGenerator {
    constructor() {
        this.apiKey = 'AIzaSyBHLOFCb_BE-iRtcUr8-Y9wHGBMVJxr3wo';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.maxRetries = 3;
        this.currentZoom = 1;
        this.zoomStep = 0.2;
        this.minZoom = 0.5;
        this.maxZoom = 3;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMermaid();
        this.validateAPIKey();
    }

    validateAPIKey() {
        if (this.apiKey === 'AIzaSyBHLOFCb_BE-iRtcUr8-Y9wHGBMVJxr3wo' || !this.apiKey || this.apiKey.length < 10) {
            console.warn('API key not configured or invalid, using demo mode');
            return false;
        }
        
        if (!this.apiKey.startsWith('AIza')) {
            console.warn('API key format may be invalid');
            return false;
        }
        
        return true;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'tao-so-do-btn') {
                this.generateSoDo();
            }
        });
    }

    loadMermaid() {
        if (typeof mermaid === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js';
            script.onload = () => {
                mermaid.initialize({
                    startOnLoad: true,
                    theme: 'default',
                    flowchart: {
                        useMaxWidth: true,
                        htmlLabels: true
                    }
                });
            };
            document.head.appendChild(script);
        }
    }

    async generateSoDo() {
        const messageInput = document.querySelector('.message-input');
        const userInput = messageInput.value.trim();

        if (!userInput) {
            this.showError('Vui lòng nhập nội dung để tạo sơ đồ!');
            return;
        }

        const button = document.getElementById('tao-so-do-btn');
        const resultContainer = document.querySelector('.so-do-result');
        
        resultContainer.style.display = 'none';
        this.setButtonLoading(button, true);
        this.showLoading(resultContainer);

        try {
            const mermaidCode = await this.callGeminiAPI(userInput);
            if (mermaidCode) {
                this.displayResult(mermaidCode, resultContainer);
            }
        } catch (error) {
            console.error('Lỗi khi tạo sơ đồ:', error);
            const errorMessage = this.getErrorMessage(error);
            this.showError(errorMessage);
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    getErrorMessage(error) {
        if (error.message.includes('404')) {
            return 'API endpoint không tìm thấy. Vui lòng kiểm tra cấu hình API key hoặc thử lại sau.';
        } else if (error.message.includes('401') || error.message.includes('403')) {
            return 'API key không hợp lệ hoặc hết hạn. Vui lòng kiểm tra lại.';
        } else if (error.message.includes('429')) {
            return 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.';
        } else if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
            return 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
        } else if (error.name === 'AbortError') {
            return 'Request timeout - vui lòng thử lại';
        }
        return 'Có lỗi xảy ra khi tạo sơ đồ.';
    }

    async callGeminiAPI(userInput, retryCount = 0) {
        const prompt = this.buildPrompt(userInput);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.1,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1000,
                    }
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Response Error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const generatedText = this.extractGeneratedText(data);
            
            if (!generatedText || generatedText.trim().length === 0) {
                throw new Error('Empty response from API');
            }
            
            const cleanedCode = this.cleanMermaidCode(generatedText);
            
            if (this.isValidMermaidCode(cleanedCode)) {
                return cleanedCode;
            } else if (retryCount < this.maxRetries) {
                console.log(`Lần thử ${retryCount + 1}: Code không hợp lệ, thử lại...`);
                return await this.callGeminiAPI(userInput, retryCount + 1);
            } else {
                throw new Error('Không thể tạo code Mermaid hợp lệ sau nhiều lần thử');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    buildPrompt(userInput) {
        return `Tạo code Mermaid.js flowchart cho yêu cầu sau. TUYỆT ĐỐI CHỈ TRẢ VỀ CODE MERMAID, KHÔNG CÓ GIẢI THÍCH HAY MARKDOWN.

QUY TẮC BẮT BUỘC:
1. Bắt đầu bằng "flowchart TD" hoặc "graph LR"
2. ID node: chỉ dùng chữ cái thường, số, dấu gạch dưới (a-z, 0-9, _)
3. Nhãn tiếng Việt: đặt trong dấu ngoặc kép ["nhãn"]
4. Tối đa 10 node, 3 cấp độ
5. Dùng [] cho thao tác, {} cho điều kiện, () cho dữ liệu
6. Kết nối: --> cho mũi tên thường, -->|text| cho mũi tên có nhãn

VÍ DỤ CHUẨN:
flowchart TD
    A["bắt đầu"] --> B{"kiểm tra điều kiện"}
    B -->|đúng| C["xử lý 1"]
    B -->|sai| D["xử lý 2"]
    C --> E["kết quả"]
    D --> E

YÊU CẦU: ${userInput}`;
    }

    extractGeneratedText(data) {
        if (!data.candidates?.[0]?.content?.parts?.[0]) {
            console.error('Invalid API response structure:', data);
            throw new Error('Invalid response format from API');
        }
        return data.candidates[0].content.parts[0].text;
    }

    cleanMermaidCode(code) {
        if (!code) return '';
        
        let cleaned = code.trim()
            .replace(/```mermaid\s*/gi, '')
            .replace(/```\s*$/gi, '')
            .replace(/```\w*\s*/gi, '')
            .replace(/<!--.*?-->/g, '')
            .replace(/\/\*.*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .replace(/\n\s*\n/g, '\n');
        
        cleaned = cleaned.split('\n').filter(line => line.trim() !== '').join('\n');
        
        const mermaidStart = cleaned.search(/(flowchart|graph)/i);
        if (mermaidStart > 0) {
            cleaned = cleaned.substring(mermaidStart);
        }
        
        return cleaned.trim();
    }

    isValidMermaidCode(code) {
        if (!code || typeof code !== 'string' || code.length < 30) return false;
        
        const trimmedCode = code.trim();
        const validStarts = ['flowchart TD', 'flowchart LR', 'graph TD', 'graph LR'];
        const hasValidStart = validStarts.some(start => 
            trimmedCode.toLowerCase().startsWith(start.toLowerCase())
        );
        
        if (!hasValidStart) return false;
        
        const hasConnections = trimmedCode.includes('-->') || 
                              trimmedCode.includes('---') || 
                              trimmedCode.includes('==>');
        
        if (!hasConnections) return false;
        
        const hasNodes = trimmedCode.includes('[') || 
                        trimmedCode.includes('{') || 
                        trimmedCode.includes('(');
        
        if (!hasNodes) return false;
        
        const hasMarkdown = trimmedCode.includes('```') || 
                           trimmedCode.includes('**') || 
                           trimmedCode.includes('##');
        
        if (hasMarkdown) return false;
        
        const lines = trimmedCode.split('\n').filter(line => line.trim() !== '');
        return lines.length >= 3;
    }

    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.innerHTML = '<span class="material-symbols-rounded">sync</span>Đang tạo...';
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.innerHTML = '<span class="material-symbols-rounded">account_tree</span>Tạo Sơ đồ';
            button.disabled = false;
        }
    }

    showLoading(container) {
        container.style.display = 'block';
        container.innerHTML = `
            <div class="so-do-loading">
                <div class="spinner"></div>
                <p>Đang tạo sơ đồ...</p>
            </div>
        `;
    }

    displayResult(mermaidCode, container) {
        container.style.display = 'block';
        container.innerHTML = `
            <div class="so-do-header">
                <div class="so-do-actions">
                    <button class="so-do-action-btn" id="view-detail-btn" title="Xem chi tiết">
                        <span class="material-symbols-rounded">zoom_in</span>
                    </button>
                    <button class="so-do-action-btn" id="download-btn" title="Tải về">
                        <span class="material-symbols-rounded">download</span>
                    </button>
                </div>
            </div>
            <div class="so-do-preview" id="mermaid-preview"></div>
        `;

        this.renderMermaidDiagram(mermaidCode, 'mermaid-preview');
        this.setupActionButtons(mermaidCode);
    }

    async renderMermaidDiagram(code, containerId, enableZoom = false) {
        try {
            const container = document.getElementById(containerId);
            container.innerHTML = '<div class="so-do-loading"><div class="spinner"></div><p>Đang render sơ đồ...</p></div>';
            
            await this.waitForMermaid();

            const diagramId = `mermaid-diagram-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const { svg } = await mermaid.render(diagramId, code);
            container.innerHTML = svg;
            
            if (enableZoom) {
                this.setupZoomFunctionality();
            }
        } catch (error) {
            console.error('Lỗi render Mermaid:', error);
            document.getElementById(containerId).innerHTML = `
                <div class="so-do-error">
                    Lỗi khi render sơ đồ: ${error.message}
                </div>
            `;
        }
    }

    async waitForMermaid() {
        if (typeof mermaid === 'undefined') {
            await new Promise(resolve => {
                const checkMermaid = setInterval(() => {
                    if (typeof mermaid !== 'undefined') {
                        clearInterval(checkMermaid);
                        resolve();
                    }
                }, 100);
            });
        }
    }

    setupActionButtons(mermaidCode) {
        document.getElementById('view-detail-btn').addEventListener('click', () => {
            this.showDetailModal(mermaidCode);
        });

        document.getElementById('download-btn').addEventListener('click', () => {
            this.downloadDiagram(mermaidCode);
        });
    }

    showDetailModal(mermaidCode) {
        const modal = document.createElement('div');
        modal.className = 'so-do-modal';
        modal.innerHTML = `
            <div class="so-do-modal-content">
                <div class="so-do-modal-header">
                    <h3>Xem chi tiết sơ đồ</h3>
                    <button class="so-do-modal-close" id="modal-close">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                <div class="so-do-modal-body">
                    <div class="so-do-modal-preview" id="modal-preview">
                        <div class="so-do-zoom-container" id="zoom-container">
                            <div class="so-do-zoom-content" id="zoom-content"></div>
                        </div>
                    </div>
                    <div class="so-do-modal-actions">
                        <button class="so-do-modal-btn" id="modal-download">
                            <span class="material-symbols-rounded">download</span>
                            Tải về
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.renderMermaidDiagram(mermaidCode, 'zoom-content', true);

        this.setupModalEventListeners(modal, mermaidCode);
    }

    setupModalEventListeners(modal, mermaidCode) {
        document.getElementById('modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('modal-download').addEventListener('click', () => {
            this.downloadDiagram(mermaidCode);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    setupZoomFunctionality() {
        const zoomContainer = document.getElementById('zoom-container');
        const zoomContent = document.getElementById('zoom-content');
        
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;

        // Mouse events
        zoomContent.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            zoomContent.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            this.applyTransform(zoomContent, translateX, translateY);
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            zoomContent.style.cursor = 'grab';
        });

        // Touch events
        zoomContent.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                startX = e.touches[0].clientX - translateX;
                startY = e.touches[0].clientY - translateY;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            e.preventDefault();
            
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            this.applyTransform(zoomContent, translateX, translateY);
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Double click to reset
        zoomContent.addEventListener('dblclick', () => {
            translateX = 0;
            translateY = 0;
            this.applyTransform(zoomContent, translateX, translateY);
        });
    }

    applyTransform(element, x, y) {
        const currentTransform = element.style.transform;
        const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
        const scale = scaleMatch ? scaleMatch[1] : '1';
        
        element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        element.style.transformOrigin = 'center center';
    }

    async downloadDiagram(mermaidCode) {
        try {
            const diagramId = 'download-diagram-' + Date.now();
            const { svg } = await mermaid.render(diagramId, mermaidCode);
            
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `so-do-${Date.now()}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            this.showSuccess('Sơ đồ đã được tải về thành công!');
        } catch (error) {
            console.error('Lỗi khi tải về:', error);
            this.showError('Lỗi khi tải về sơ đồ');
        }
    }

    showError(message) {
        const resultContainer = document.querySelector('.so-do-result');
        resultContainer.style.display = 'block';
        resultContainer.innerHTML = `
            <div class="so-do-error">
                <strong>❌ Lỗi:</strong> ${message}
            </div>
        `;
    }

    showSuccess(message) {
        const resultContainer = document.querySelector('.so-do-result');
        const successDiv = document.createElement('div');
        successDiv.className = 'so-do-success';
        successDiv.innerHTML = `<strong>✅ Thành công:</strong> ${message}`;
        
        resultContainer.insertBefore(successDiv, resultContainer.firstChild);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }
}

// Khởi tạo tính năng khi trang load xong
document.addEventListener('DOMContentLoaded', () => {
    window.soDoGenerator = new SoDoGenerator();
});

// Export class để có thể sử dụng từ bên ngoài
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoDoGenerator;
} 