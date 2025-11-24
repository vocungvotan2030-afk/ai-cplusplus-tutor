// ************ ĐÃ CẬP NHẬT: KHÓA API CỦA BẠN ĐÃ ĐƯỢC THAY THẾ Ở ĐÂY ************
// Lưu ý: Khóa API được lưu trữ cục bộ, không hiển thị trong phản hồi.
const GEMINI_API_KEY = "AIzaSyAVY-byKHlpxaKSL8X1kjcC7LX3TYbTDI8";

// Khởi tạo SDK
// Sử dụng 'new GoogleGenAI' vì chúng ta đã thêm thư viện bằng thẻ script trong index.html
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const model = "gemini-2.5-flash"; // Mô hình tối ưu cho các tác vụ giải thích và tạo nội dung nhanh

// Lấy các phần tử HTML
const sendButton = document.getElementById('send-button');
const userPromptInput = document.getElementById('user-prompt');
const topicLevelSelect = document.getElementById('topic-level');
const responseArea = document.getElementById('ai-response-area');

// Sự kiện khi nhấn nút
sendButton.addEventListener('click', generateContent);

/**
 * Xử lý việc gửi yêu cầu đến Gemini API và hiển thị kết quả.
 */
async function generateContent() {
    const userPrompt = userPromptInput.value.trim();
    const level = topicLevelSelect.value;
    
    if (!userPrompt) {
        alert("Vui lòng nhập câu hỏi hoặc chủ đề học tập.");
        return;
    }

    // Hiển thị trạng thái đang tải và vô hiệu hóa nút
    responseArea.innerHTML = '<p class="placeholder">Đang hỏi Gia sư AI... Vui lòng đợi...</p>';
    sendButton.disabled = true;

    // Xây dựng Prompt chi tiết và hướng dẫn vai trò
    const fullPrompt = `
        Bạn là Gia sư lập trình C++ chuyên nghiệp, kiên nhẫn và có kinh nghiệm giảng dạy.
        Nhiệm vụ của bạn là giải thích, cung cấp ví dụ mã, và tóm tắt.
        
        Phản hồi phải bao gồm 3 phần rõ ràng: **GIẢI THÍCH LÝ THUYẾT**, **MÃ VÍ DỤ C++** (được đặt trong khối code Markdown), và **TÓM TẮT ĐIỂM CHÍNH**.
        
        Yêu cầu của học viên (Cấp độ: ${level}): ${userPrompt}

        Hướng dẫn:
        1. Giải thích chi tiết, sử dụng ngôn ngữ thân thiện, phù hợp với cấp độ ${level}.
        2. Cung cấp một ví dụ mã C++ hoàn chỉnh, có thể chạy được (bao gồm cả #include <iostream> và hàm main).
        3. Sử dụng Markdown tiêu chuẩn để định dạng (tiêu đề, danh sách, khối mã).
    `;

    try {
        // Gọi Gemini API
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
        });

        // Hiển thị kết quả
        responseArea.innerHTML = response.text;
        
        // Kích hoạt highlight.js để làm đẹp khối mã C++
        // Đây là hàm toàn cục được cung cấp bởi thư viện highlight.min.js
        hljs.highlightAll(); 

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        // Cần kiểm tra kỹ Khóa API nếu gặp lỗi 400 hoặc 403
        responseArea.innerHTML = '<p style="color: red; text-align: center;">Đã xảy ra lỗi khi kết nối với AI. Vui lòng kiểm tra Khóa API, kết nối mạng hoặc giới hạn sử dụng.</p>';
    } finally {
        // Kích hoạt lại nút
        sendButton.disabled = false;
    }
}