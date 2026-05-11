docs/CHATBOT_AI.md🟢 GIAI ĐOẠN 1: THIẾT LẬP NỀN TẢNG (THE FOUNDATION)

Mục tiêu: Chuẩn bị môi trường để Code và AI có thể nói chuyện được với nhau.

1. Bước 1: Lấy API Key:
  * Sếp truy cập OpenAI Dashboard để lấy OPENAI_API_KEY.
  * (Nếu sếp muốn dùng đồ của Google, hãy lấy GEMINI_API_KEY từ Google AI Studio - cũng rất mạnh và rẻ).
2. Bước 2: Cấu hình biến môi trường:
  * Mở file .env ở cả Backend (NodeJS) và Frontend (ReactJS).
  * Thêm: OPENAI_API_KEY=your_key_here.
3. Bước 3: Cài đặt thư viện:
  * Mở Terminal tại thư mục NodeJS:

bash
npm install langchain @langchain/openai @langchain/community pgvector pg

  * Giải thích: langchain là khung xương, openai là bộ não, pgvector là bộ nhớ để lưu dữ liệu y tế.

---

🔵 GIAI ĐOẠN 2: CHUẨN BỊ DỮ LIỆU (DATA INGESTION)

Mục tiêu: Dạy cho AI biết về các bài viết Cẩm nang, Bác sĩ và Chuyên khoa trong DB của sếp.

1. Bước 4: Kích hoạt Vector DB:
  * Nếu sếp dùng Postgres, hãy cài extension pgvector. (Nếu sếp dùng Docker, tôi sẽ hướng dẫn lệnh cài).
2. Bước 5: Viết Script "Học việc" (Ingestion Script):
  * Viết một hàm trong NodeJS để:
    * Đọc tất cả bài viết từ bảng Handbooks, Specialties.
    * Chia nhỏ văn bản (Chunking): Ví dụ một bài cẩm nang 2000 chữ, sếp chia thành 4 đoạn 500 chữ.
    * Chuyển văn bản thành Vector (Embedding) qua OpenAI API.
    * Lưu vào bảng Vector trong DB.

---

🟡 GIAI ĐOẠN 3: XÂY DỰNG BỘ NÃO (THE AI BACKEND)

Mục tiêu: Xử lý câu hỏi của người dùng.

1. Bước 6: Tạo API Chat (/api/chat-ai):
  * Tạo một Controller mới để nhận câu hỏi từ Client.
2. Bước 7: Thiết lập luồng RAG (Retrieval-Augmented Generation):
  * Khi có câu hỏi -> AI đi tìm trong Vector DB xem có thông tin nào liên quan không.
  * Lấy thông tin đó + Câu hỏi của User -> Gửi cho GPT-4o với một cái "Lệnh" (System Prompt) thật nghiêm ngặt.
3. Bước 8: Trả kết quả dạng Stream:
  * Cấu hình để AI trả lời theo kiểu gõ chữ từng ký tự cho mượt (Streaming).

---

🔴 GIAI ĐOẠN 4: GIAO DIỆN NGƯỜI DÙNG (FRONTEND INTEGRATION)

Mục tiêu: Mang AI đến tay bệnh nhân.

1. Bước 9: Tạo Component ChatWidget:
  * Một nút bấm nổi ở góc màn hình. Khi bấm sẽ hiện khung chat Apple-style (giống cái sếp làm hôm nọ).
2. Bước 10: Kết nối API:
  * Gửi câu hỏi lên Backend và hiển thị câu trả lời.
  * Thêm các nút gợi ý: "Đặt lịch khám Thần kinh", "Xem bài viết về Đau đầu".

---

🚀 VIỆC CẦN LÀM NGAY BÂY GIỜ (ACTION ITEM)

Để bắt đầu, sếp hãy xác nhận với tôi: Sếp muốn dùng Database nào để lưu Vector?

1. Lựa chọn A (Khuyên dùng): Dùng chính PostgreSQL hiện tại và cài thêm pgvector (Rất tiện vì sếp đang có sẵn DB).
2. Lựa chọn B: Dùng một Cloud DB chuyên dụng như Pinecone (Miễn phí, cực nhanh, không cần cài đặt gì vào máy).

Sếp chọn A hay B để tôi viết code mẫu chi tiết cho sếp bắt đầu bước đầu tiên nào? 🫡🔥🚀

