// JavaScript cho tính năng tạo sơ đồ - Logic ban đầu
class SoDoGenerator {
    constructor() {
        this.apiKey = 'AIzaSyBHLOFCb_BE-iRtcUr8-Y9wHGBMVJxr3wo'; // API key thực
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.maxRetries = 3;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMermaid();
        this.validateAPIKey();
    }

    validateAPIKey() {
        // Kiểm tra API key có hợp lệ không
        if (this.apiKey === 'AIzaSyBHLOFCb_BE-iRtcUr8-Y9wHGBMVJxr3wo' || !this.apiKey || this.apiKey.length < 10) {
            console.warn('API key not configured or invalid, using demo mode');
            return false;
        }
        
        // Kiểm tra format API key (Google API keys thường bắt đầu bằng AIza)
        if (!this.apiKey.startsWith('AIza')) {
            console.warn('API key format may be invalid');
            return false;
        }
        
        return true;
    }

    setupEventListeners() {
        // Lắng nghe sự kiện click vào button tạo sơ đồ
        document.addEventListener('click', (e) => {
            if (e.target.id === 'tao-so-do-btn') {
                this.generateSoDo();
            }
        });

        // Chỉ giữ lại logic tạo sơ đồ
    }

    loadMermaid() {
        // Load Mermaid.js từ CDN
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

        // Sử dụng API thực để tạo sơ đồ
        // Không cần kiểm tra demo mode nữa

        const button = document.getElementById('tao-so-do-btn');
        const resultContainer = document.querySelector('.so-do-result');
        
        // Clear kết quả cũ
        resultContainer.style.display = 'none';
        
        // Hiển thị trạng thái loading
        this.setButtonLoading(button, true);
        this.showLoading(resultContainer);

        try {
            const mermaidCode = await this.callGeminiAPI(userInput);
            if (mermaidCode) {
                this.displayResult(mermaidCode, resultContainer);
            }
        } catch (error) {
            console.error('Lỗi khi tạo sơ đồ:', error);
            
            // Xử lý lỗi cụ thể
            let errorMessage = 'Có lỗi xảy ra khi tạo sơ đồ.';
            
            if (error.message.includes('404')) {
                errorMessage = 'API endpoint không tìm thấy. Vui lòng kiểm tra cấu hình API key hoặc thử lại sau.';
            } else if (error.message.includes('401') || error.message.includes('403')) {
                errorMessage = 'API key không hợp lệ hoặc hết hạn. Vui lòng kiểm tra lại.';
            } else if (error.message.includes('429')) {
                errorMessage = 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.';
            } else if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
                errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
            }
            
            this.showError(errorMessage);
            
            // Không fallback về demo nữa, chỉ hiển thị lỗi
            console.log('API error occurred, not falling back to demo');
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    async callGeminiAPI(userInput, retryCount = 0) {
        const prompt = `Tạo code Mermaid.js flowchart cho yêu cầu sau. TUYỆT ĐỐI CHỈ TRẢ VỀ CODE MERMAID, KHÔNG CÓ GIẢI THÍCH HAY MARKDOWN.

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

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây timeout
            
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
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
            
            // Kiểm tra cấu trúc response
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
                console.error('Invalid API response structure:', data);
                throw new Error('Invalid response format from API');
            }
            
            const generatedText = data.candidates[0].content.parts[0].text;
            
            if (!generatedText || generatedText.trim().length === 0) {
                throw new Error('Empty response from API');
            }
            
            // Clean code Mermaid
            const cleanedCode = this.cleanMermaidCode(generatedText);
            
            // Kiểm tra xem có phải code Mermaid hợp lệ không
            if (this.isValidMermaidCode(cleanedCode)) {
                return cleanedCode;
            } else {
                // Nếu không hợp lệ và chưa hết số lần thử, thử lại
                if (retryCount < this.maxRetries) {
                    console.log(`Lần thử ${retryCount + 1}: Code không hợp lệ, thử lại...`);
                    return await this.callGeminiAPI(userInput, retryCount + 1);
                } else {
                    throw new Error('Không thể tạo code Mermaid hợp lệ sau nhiều lần thử');
                }
            }
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - vui lòng thử lại');
            }
            
            console.error('API Error:', error);
            throw error;
        }
    }

    cleanMermaidCode(code) {
        if (!code) return '';
        
        let cleaned = code.trim();
        
        // Loại bỏ markdown code blocks
        cleaned = cleaned.replace(/```mermaid\s*/gi, '');
        cleaned = cleaned.replace(/```\s*$/gi, '');
        cleaned = cleaned.replace(/```\w*\s*/gi, '');
        
        // Loại bỏ các comment và giải thích
        cleaned = cleaned.replace(/<!--.*?-->/g, '');
        cleaned = cleaned.replace(/\/\*.*?\*\//g, '');
        cleaned = cleaned.replace(/\/\/.*$/gm, ''); // Loại bỏ comment //
        
        // Loại bỏ các dòng trống thừa
        cleaned = cleaned.replace(/\n\s*\n/g, '\n');
        
        // Loại bỏ các dòng chỉ có khoảng trắng
        cleaned = cleaned.split('\n').filter(line => line.trim() !== '').join('\n');
        
        // Loại bỏ text không phải Mermaid ở đầu và cuối
        const mermaidStart = cleaned.search(/(flowchart|graph)/i);
        if (mermaidStart > 0) {
            cleaned = cleaned.substring(mermaidStart);
        }
        
        return cleaned.trim();
    }

    isValidMermaidCode(code) {
        if (!code || typeof code !== 'string') return false;
        
        const trimmedCode = code.trim();
        
        // Kiểm tra độ dài tối thiểu
        if (trimmedCode.length < 30) return false;
        
        // Kiểm tra bắt đầu đúng
        const validStarts = ['flowchart TD', 'flowchart LR', 'graph TD', 'graph LR'];
        const hasValidStart = validStarts.some(start => 
            trimmedCode.toLowerCase().startsWith(start.toLowerCase())
        );
        
        if (!hasValidStart) return false;
        
        // Kiểm tra có kết nối
        const hasConnections = trimmedCode.includes('-->') || 
                              trimmedCode.includes('---') || 
                              trimmedCode.includes('==>');
        
        if (!hasConnections) return false;
        
        // Kiểm tra có node
        const hasNodes = trimmedCode.includes('[') || 
                        trimmedCode.includes('{') || 
                        trimmedCode.includes('(');
        
        if (!hasNodes) return false;
        
        // Kiểm tra không có markdown
        const hasMarkdown = trimmedCode.includes('```') || 
                           trimmedCode.includes('**') || 
                           trimmedCode.includes('##');
        
        if (hasMarkdown) return false;
        
        // Kiểm tra không có giải thích dài
        const lines = trimmedCode.split('\n');
        const codeLines = lines.filter(line => line.trim() !== '');
        
        if (codeLines.length < 3) return false;
        
        return true;
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

        // Render Mermaid diagram
        this.renderMermaidDiagram(mermaidCode, 'mermaid-preview');
        
        // Setup action buttons
        this.setupActionButtons(mermaidCode);
    }

    async renderMermaidDiagram(code, containerId) {
        try {
            const container = document.getElementById(containerId);
            container.innerHTML = '<div class="so-do-loading"><div class="spinner"></div><p>Đang render sơ đồ...</p></div>';
            
            // Đợi Mermaid load xong
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

            // Tạo unique ID cho diagram
            const diagramId = 'mermaid-diagram-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

            // Render diagram
            const { svg } = await mermaid.render(diagramId, code);
            container.innerHTML = svg;
        } catch (error) {
            console.error('Lỗi render Mermaid:', error);
            document.getElementById(containerId).innerHTML = `
                <div class="so-do-error">
                    Lỗi khi render sơ đồ: ${error.message}
                </div>
            `;
        }
    }

    async renderMermaidDiagramWithZoom(code, containerId) {
        try {
            const container = document.getElementById(containerId);
            container.innerHTML = '<div class="so-do-loading"><div class="spinner"></div><p>Đang render sơ đồ...</p></div>';
            
            // Đợi Mermaid load xong
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

            // Tạo unique ID cho diagram
            const diagramId = 'mermaid-diagram-zoom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

            // Render diagram
            const { svg } = await mermaid.render(diagramId, code);
            container.innerHTML = svg;
            
            // Setup zoom functionality after rendering
            this.setupZoomFunctionality();
        } catch (error) {
            console.error('Lỗi render Mermaid:', error);
            document.getElementById(containerId).innerHTML = `
                <div class="so-do-error">
                    Lỗi khi render sơ đồ: ${error.message}
                </div>
            `;
        }
    }

    setupZoomControls() {
        let currentZoom = 1;
        const zoomStep = 0.2;
        const minZoom = 0.5;
        const maxZoom = 3;

        const zoomContainer = document.getElementById('zoom-container');
        const zoomContent = document.getElementById('zoom-content');

        // Zoom in button
        document.getElementById('zoom-in-btn').addEventListener('click', () => {
            if (currentZoom < maxZoom) {
                currentZoom += zoomStep;
                this.applyZoom(zoomContent, currentZoom);
            }
        });

        // Zoom out button
        document.getElementById('zoom-out-btn').addEventListener('click', () => {
            if (currentZoom > minZoom) {
                currentZoom -= zoomStep;
                this.applyZoom(zoomContent, currentZoom);
            }
        });

        // Reset zoom button
        document.getElementById('reset-zoom-btn').addEventListener('click', () => {
            currentZoom = 1;
            this.applyZoom(zoomContent, currentZoom);
        });

        // Mouse wheel zoom
        zoomContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
            const newZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + delta));
            currentZoom = newZoom;
            this.applyZoom(zoomContent, currentZoom);
        });
    }

    setupZoomFunctionality() {
        const zoomContainer = document.getElementById('zoom-container');
        const zoomContent = document.getElementById('zoom-content');
        
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;

        // Mouse events for panning
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

        // Touch events for mobile
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

    applyZoom(element, zoom) {
        element.style.transform = `scale(${zoom})`;
        element.style.transformOrigin = 'center center';
    }

    applyTransform(element, x, y) {
        const currentTransform = element.style.transform;
        const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
        const scale = scaleMatch ? scaleMatch[1] : '1';
        
        element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        element.style.transformOrigin = 'center center';
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





    setupActionButtons(mermaidCode) {
        // View detail button
        document.getElementById('view-detail-btn').addEventListener('click', () => {
            this.showDetailModal(mermaidCode);
        });

        // Download button
        document.getElementById('download-btn').addEventListener('click', () => {
            this.downloadDiagram(mermaidCode);
        });
    }

    showDetailModal(mermaidCode) {
        // Create modal for detailed view with zoom functionality
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

        // Render diagram in modal with zoom functionality
        this.renderMermaidDiagramWithZoom(mermaidCode, 'zoom-content');



        // Setup modal actions
        document.getElementById('modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('modal-download').addEventListener('click', () => {
            this.downloadDiagram(mermaidCode);
        });

        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    async downloadDiagram(mermaidCode) {
        try {
            const diagramId = 'download-diagram-' + Date.now();
            const { svg } = await mermaid.render(diagramId, mermaidCode);
            
            // Convert SVG to blob
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = `so-do-${Date.now()}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Cleanup
            URL.revokeObjectURL(url);
            
            this.showSuccess('Sơ đồ đã được tải về thành công!');
        } catch (error) {
            console.error('Lỗi khi tải về:', error);
            this.showError('Lỗi khi tải về sơ đồ');
        }
    }

    async copyCodeToClipboard(mermaidCode) {
        try {
            await navigator.clipboard.writeText(mermaidCode);
            this.showSuccess('Code đã được sao chép vào clipboard!');
        } catch (error) {
            console.error('Lỗi khi sao chép:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = mermaidCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showSuccess('Code đã được sao chép vào clipboard!');
        }
    }

    showSuccess(message) {
        const resultContainer = document.querySelector('.so-do-result');
        const successDiv = document.createElement('div');
        successDiv.className = 'so-do-success';
        successDiv.innerHTML = `<strong>✅ Thành công:</strong> ${message}`;
        
        // Insert at the top of result container
        resultContainer.insertBefore(successDiv, resultContainer.firstChild);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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