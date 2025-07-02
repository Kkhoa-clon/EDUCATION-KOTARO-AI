// Lấy các phần tử DOM cần thiết
const chatBody = document.querySelector(".chat-body"); // Khung hiển thị nội dung chat
const messageInput = document.querySelector(".message-input"); // Ô nhập tin nhắn
const sendMessageButton = document.querySelector("#send-message"); // Nút gửi tin nhắn
const fileInput = document.querySelector("#file-input"); // Input chọn file
const fileUploadWrapper = document.querySelector(".file-upload-wrapper"); // Khung hiển thị file đã chọn
const fileCancelButton = document.querySelector("#file-cancel"); // Nút hủy file
const chatbotToggler = document.querySelector("#chatbot-toggler"); // Nút mở/đóng chatbot
const closeChatbot = document.querySelector("#close-chatbot"); // Nút đóng chatbot

// Cấu hình API
const API_KEY = "AIzaSyBninbq7h5tAnlzcHLQ8UYryQ-2AAXJTl8"; // API key để kết nối với Gemini
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`; // URL endpoint API

// Đối tượng lưu dữ liệu người dùng
const userData = {
    message: null, // Tin nhắn người dùng
    file: { // File đính kèm
        data: null, // Dữ liệu file dạng base64
        mime_type: null // Loại file
    }
};

// Lịch sử chat (ban đầu rỗng)
const chatHistory = [];

// Lưu chiều cao ban đầu của ô nhập tin nhắn
const initialInputHeight = messageInput.scrollHeight;

// Hàm tạo phần tử tin nhắn mới
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div"); // Tạo thẻ div
    div.classList.add("message", ...classes); // Thêm các class CSS
    div.innerHTML = content; // Gán nội dung HTML
    return div; // Trả về phần tử đã tạo
};

// Hàm render markdown an toàn và highlight code, hỗ trợ bảng, danh sách, JSON, công thức, HTML
function renderBotOutput(rawText) {
    // Kiểm tra nếu là JSON
    try {
        const jsonObj = JSON.parse(rawText);
        return `<pre><code class="json">${JSON.stringify(jsonObj, null, 2)}</code></pre>`;
    } catch (e) {}
    // Nếu không phải JSON, render markdown (có hỗ trợ bảng, danh sách, code, công thức)
    const html = marked.parse(rawText, {
        breaks: true,
        gfm: true,
        headerIds: false,
        mangle: false,
        sanitize: false // Để tự xử lý XSS phía dưới
    });
    // Tạo thẻ div tạm để loại bỏ script nguy hiểm
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    // Loại bỏ script/style tag
    tempDiv.querySelectorAll('script, style').forEach(el => el.remove());
    // Highlight code block
    if (window.hljs) {
        tempDiv.querySelectorAll('pre code').forEach(block => {
            window.hljs.highlightElement(block);
        });
    }
    // Thêm class cho bảng và danh sách để CSS đẹp hơn
    tempDiv.querySelectorAll('table').forEach(tbl => tbl.classList.add('chatbot-table'));
    tempDiv.querySelectorAll('ul,ol').forEach(list => list.classList.add('chatbot-list'));
    return tempDiv.innerHTML;
}

// Hàm tạo phản hồi từ bot qua API
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text"); // Lấy phần hiển thị nội dung

    // Thêm tin nhắn người dùng vào lịch sử chat
    chatHistory.push({
        role: "user",
        parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])],
    });

    // Cấu hình request gửi đến API
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: chatHistory
        })
    }

    try {
        // Gọi API để lấy phản hồi từ bot
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Lỗi không xác định từ API');

        // Xử lý và hiển thị phản hồi từ bot
        const apiResponseText = data.candidates[0].content.parts[0].text.trim();
        messageElement.innerHTML = renderBotOutput(apiResponseText);
        // Gọi MathJax để render công thức toán học nếu có
        if (window.MathJax) {
            MathJax.typesetPromise([messageElement]);
        }
        // Lưu phản hồi vào lịch sử chat
        chatHistory.push({
            role: "model",
            parts: [{ text: apiResponseText }]
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        handleApiError(messageElement, error);
    } finally {
        // Dọn dẹp sau khi xử lý xong
        userData.file = {};
        incomingMessageDiv.classList.remove("thinking");
        scrollToBottom();
    }
};

// Hàm xử lý khi người dùng gửi tin nhắn
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    // Lấy nội dung tin nhắn và xóa ô nhập
    userData.message = messageInput.value.trim();
    if (!userData.message) return;
    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event("input"));

    // Tạo và hiển thị tin nhắn người dùng
    const messageContent = `<div class="message-text"></div>
                            ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;

    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").innerText = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Hiển thị trạng thái "bot đang suy nghĩ" sau 0.6s
    setTimeout(() => {
        // Lấy avatar từ localStorage hoặc dùng mặc định
        const botAvatarUrl = localStorage.getItem('botAvatarUrl') || 'https://i.pinimg.com/736x/1b/9d/20/1b9d203c25c64fac1117c96309808415.jpg';

        // Tạo nội dung tin nhắn "đang suy nghĩ"
        const messageContent = `
            <img class="bot-avatar" src="${botAvatarUrl}" alt="Bot Avatar">
            <div class="message-text">
                <div class="thinking-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>`;

        const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        scrollToBottom();

        // Xử lý nếu không tải được avatar
        const avatarImg = incomingMessageDiv.querySelector('.bot-avatar');
        avatarImg.onerror = function() {
            this.src = 'https://i.pinimg.com/736x/1b/9d/20/1b9d203c25c64fac1117c96309808415.jpg';
        };

        // Gọi API để lấy phản hồi từ bot
        generateBotResponse(incomingMessageDiv);
    }, 600);
};

// Hàm cập nhật avatar bot
function updateBotAvatar(newAvatarUrl) {
    // Lưu vào localStorage để giữ avatar khi refresh trang
    localStorage.setItem('botAvatarUrl', newAvatarUrl);

    // Cập nhật tất cả avatar bot trong chat
    document.querySelectorAll('.bot-avatar').forEach(avatar => {
        avatar.src = newAvatarUrl;
    });
}

// Xử lý sự kiện nhấn Enter để gửi tin nhắn
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768) {
        handleOutgoingMessage(e);
    }
});

// Tự động điều chỉnh chiều cao ô nhập tin nhắn
messageInput.addEventListener("input", (e) => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.boderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

// Xử lý khi người dùng chọn file
fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
        // Hiển thị thông báo lỗi nếu file không hợp lệ với z-index cao nhất
        await Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)',
            confirmButtonText: 'OK',
            customClass: {
                popup: 'high-z-index-swal' // Thêm class custom cho popup
            },
            didOpen: () => {
                // Đảm bảo popup luôn hiển thị trên tất cả các phần tử khác
                const popup = Swal.getPopup();
                popup.style.zIndex = '999999';
            }
        });
        resetFileInput();
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];
        userData.file = {
            data: base64String,
            mime_type: file.type
        };
    };
    reader.readAsDataURL(file);
});

// Xử lý khi nhấn nút hủy file
fileCancelButton.addEventListener("click", (e) => {
    userData.file = {};
    fileUploadWrapper.classList.remove("file-uploaded");
});

// Khởi tạo emoji picker
const picker = new EmojiMart.Picker({
    theme: "light",
    showSkinTones: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        // Chèn emoji vào vị trí con trỏ trong ô nhập
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
        // Đóng emoji picker khi click ra ngoài
        if (e.target.id === "emoji-picker") {
            document.body.classList.toggle("show-emoji-picker");
        } else {
            document.body.classList.remove("show-emoji-picker");
        }
    },
});

// Thêm emoji picker vào form chat
document.querySelector(".chat-form").appendChild(picker);

// Gán sự kiện cho các nút
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", (e) => fileInput.click());
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// Hàm thay đổi logo và avatar chatbot
function updateChatbotImages(logoUrl, avatarUrl) {
    // Cập nhật logo
    const logo = document.querySelector('.chatbot-logo');
    if (logo) {
        logo.src = logoUrl;
        logo.onerror = function() {
            logo.src = 'https://i.pinimg.com/736x/1b/9d/20/1b9d203c25c64fac1117c96309808415.jpg';
        };
    }

    // Cập nhật avatar
    const avatar = document.querySelector('.bot-avatar');
    if (avatar) {
        avatar.src = avatarUrl;
        avatar.onerror = function() {
            avatar.src = 'https://i.pinimg.com/736x/1b/9d/20/1b9d203c25c64fac1117c96309808415.jpg';
        };
    }
}

// Sự kiện mở/đóng extra-popup
const extraHeaderBtn = document.getElementById('extra-header-btn');
const closeExtraPopup = document.getElementById('close-extra-popup');

extraHeaderBtn.addEventListener('click', () => {
    document.body.classList.toggle('show-extra-popup');
});
closeExtraPopup.addEventListener('click', () => {
    document.body.classList.remove('show-extra-popup');
});

// ========== ERROR HANDLING ========== //
function handleApiError(messageElement, error) {
    let msg = error.message || error.toString();
    if (msg.includes('overloaded')) {
        msg = 'Hệ thống AI đang quá tải. Vui lòng thử lại sau vài phút!';
    }
    messageElement.innerHTML = `<span style="color:#ff0000">${msg}</span>`;
}

// ========== UI & RENDER ========== //
function scrollToBottom() {
    chatBody.scrollTo({ behavior: "smooth", top: chatBody.scrollHeight });
}
function resetFileInput() {
    fileInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    const img = fileUploadWrapper.querySelector("img");
    if (img) img.src = "#";
    userData.file = { data: null, mime_type: null };
    const form = document.querySelector(".chat-form");
    if (form) form.reset();
}

