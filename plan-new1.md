# 🌟 BẢN THIẾT KẾ & KẾ HOẠCH CẢI TỔ TOÀN DIỆN TRANG CHỦ BOOKINGCARE (APPLE STYLE SYSTEM)
> **Tác giả:** Chuyên gia Hệ thống & UI/UX cấp cao (cline Agent)
> **Dự án:** BookingCare Nền tảng Y tế Số
> **Ngôn ngữ thiết kế chính:** Apple Minimalist Design System (Flat surfaces, 28px corners, frosted glass controls, no shadows).

---

## I. Phân Tích Đánh Giá UX & Giải Pháp Thu Nhỏ Banner

### 1. Phân tích hiện trạng Banner (Hero Section)
*   **Vấn đề UX:** Hiện tại, banner chính có chiều cao quá lớn (chiếm trọn màn hình `100vh` ở một số độ phân giải). Bố cục này chỉ phù hợp với các trang giới thiệu sản phẩm tĩnh. Đối với một cổng dịch vụ y tế và đặt lịch (BookingCare), việc này tạo ra **điểm ma sát (friction)** lớn. Người dùng phải cuộn trang khá nhiều mới tìm thấy các tiện ích cốt lõi hoặc chuyên khoa cần thiết, dẫn đến việc tăng tỷ lệ thoát trang (Bounce Rate) và giảm tỷ lệ hoàn tất mục tiêu (Conversion Rate).
*   **Mục tiêu cải cách:** "Ép chặt và nhường chỗ" (Squeeze & Yield). Chúng ta cần giải phóng không gian màn hình đầu tiên (Above the fold) để hiển thị **Thanh điều hướng phân hệ tương tác** mà không làm mất đi tính thẩm mỹ thương hiệu.

### 2. Giải pháp tái cấu trúc CSS & Layout
*   **Chiều cao tối ưu:** Sẽ giảm chiều cao vùng Banner từ tự do xuống cố định ở mức **40vh đến 45vh** trên phiên bản desktop, và tự động co dãn trên mobile.
*   **Bố cục bất đối xứng tinh tế (Asymmetric Layout):**
    *   **Bên trái (45% chiều rộng):** Chữ khẩu hiệu (SF Pro Display, bold, size lớn khoảng `32px - 40px`, tracking `-0.6px`) được tinh chỉnh sắc sảo, đi kèm một nút hành động chính (CTA) bo tròn chuẩn Apple `#0071e3`.
    *   **Bên phải (55% chiều rộng):** Hình ảnh hoặc họa tiết y tế cao cấp được làm mờ nhẹ, lồng ghép mượt mà vào khung canvas nền `#f5f5f7` để làm nền đẩy khối nội dung bên trái nổi bật lên.
*   **Vùng chuyển tiếp:** Ngay sát mép dưới của Banner sẽ là một **Segmented Control Bar (Thanh chọn tab)** được thiết kế mờ ảo (Frosted glass effect) để người bệnh lập tức tương tác chuyển đổi giữa 4 phân hệ chức năng.

---

## II. [TÍNH NĂNG MỚI] Nút "Chat / Liên Hệ Bác Sĩ" Tại Header (Patient ↔ Doctor)

Để đáp ứng nhu cầu gia tăng kết nối trực tiếp và chuyển đổi cao giữa người bệnh và đội ngũ y tế chuyên nghiệp, chúng ta sẽ thiết lập tính năng **"Chat / Liên hệ Bác sĩ"** ngay trên thanh điều hướng đầu trang.

### 1. Vị trí và Thiết kế trên `HomeHeader`
*   **Thay đổi vị trí:** Thay thế nút "Hỗ trợ" hoặc "Hỗ trợ AI" hiện có tại Header thành một nút bấm cao cấp mang tên **"Chat / Liên hệ Bác sĩ"** (có thể dịch đa ngôn ngữ tương thích hệ thống).
*   **Kiểu dáng (Styling):** Nút được thiết kế dạng Pill-shape mỏng nhẹ, nền màu bạc mờ `rgba(210, 210, 215, 0.4)` với hiệu ứng mờ kính `backdrop-filter: blur(10px)`. Khi người dùng di chuột qua (hover), nút sẽ chuyển động chuyển màu mượt mà sang xanh Azure nhẹ `#0071e3` cùng icon bong bóng trò chuyện (`far fa-comments`).

### 2. Giải pháp Thiết kế Component Trực quan (Hardcoded UI) & Kiến trúc thư mục nghiêm ngặt
Do giai đoạn này tập trung tối ưu hóa trải nghiệm khách hàng (UI/UX), phân hệ Chat sẽ được dựng **giao diện mẫu chất lượng cao (High-Fidelity Mockup)** chuẩn Apple, hoạt động độc lập ở Front-end:

*   **[LƯU Ý KIẾN TRÚC - QUAN TRỌNG]:** Component `DoctorChatDrawer` sẽ trực thuộc thư mục quản lý của `HomeHeader`. Component này sẽ nằm tại `ReactJS/src/containers/HomePage/DoctorChatDrawer.js`, **tách biệt hoàn toàn và nằm ngoài thư mục `HomeTabs`** để đảm bảo quản lý phân quyền và cấu trúc Module hóa rõ ràng.
*   **Hình thức hiển thị:** Mở ra một **Slide-over Panel (Bảng trượt từ cạnh phải màn hình - Drawer)** rộng khoảng `380px`, mờ ảo toàn bộ bằng thuộc tính `backdrop-filter: blur(35px)` và màu nền kính mờ trắng `rgba(255, 255, 255, 0.72)`.
*   **Cơ chế hoạt động:**
    *   Người dùng click nút "Chat" ➡️ State `isOpenDoctorChat: true` ➡️ Drawer trượt nhẹ nhàng ra từ góc phải với độ trễ chuyển động `0.34s ease-out-back`.
    *   **Khu vực 1: Danh sách bác sĩ tư vấn (Sidebar thu nhỏ):** Chứa ảnh đại diện tròn của 3-4 bác sĩ tiêu biểu (ví dụ: Bác sĩ Nguyễn Văn Mai, Bác sĩ Trần Thị Lan...) kèm dấu chấm xanh hiển thị trạng thái đang trực tuyến (Online).
    *   **Khu vực 2: Khung chat mô phỏng (Chat Interface):** Khi click vào một bác sĩ, màn hình chat sẽ hiện lên các bong bóng thoại chứa tin nhắn mẫu sinh động:
        *   *Tin nhắn bác sĩ:* "Chào bạn! Tôi có thể hỗ trợ giải đáp gì về triệu chứng của bạn hôm nay?"
        *   *Tin nhắn người bệnh (mẫu):* "Tôi bị nhức mỏi cổ vai gáy mấy hôm nay..."
        *   *Tin nhắn hệ thống:* "Lịch hẹn của bạn với bác sĩ này đã được xác nhận vào ngày mai."
    *   **Khu vực 3: Ô soạn thảo:** Chữ mờ placeholder *"Nhập tin nhắn..."* cùng phím gửi (Send) thiết kế góc cạnh tinh xảo.

---

## III. Thiết Kế 4 Khu Vực Lựa Chọn Chính (Giữ Nguyên Cốt Lõi)

Hệ thống Tab tương tác gồm 4 Phân hệ chính nằm dưới Banner sẽ có cấu trúc như sau:

### Phân hệ 1.1: Giới thiệu (Overview)
*   Thừa hưởng nội dung giới thiệu phòng khám, độ bao phủ mạng lưới y tế, đối tác... của trang chủ cũ.
*   Tái thiết kế bố cục dạng **Bento Grid** (lưới các ô vuông bo góc lớn `28px` ghép liền mạch) kết hợp với các con số thống kê ấn tượng (Enormous Numbers ở size `40px` - `56px`), tạo cảm giác sang trọng và chững chạc đúng tinh thần Apple.

### Phân hệ 1.2: Quy trình đặt khám tương tác (Interactive Booking Stepper)
Sơ đồ tiến trình (Stepper) trực quan tương ứng với hệ thống thực tế của BookingCare:
*   **Bước 1: Chọn Chuyên khoa / Dịch vụ**
    *   *Mô tả:* Lựa chọn chuyên khoa phù hợp (Tai Mũi Họng, Cơ Xương Khớp...) hoặc dịch vụ khám.
    *   *Hành động khi Click:* Route trực tiếp tới `/select-service` hoặc `/all-specialty`.
*   **Bước 2: Chọn Bác sĩ & Khung giờ phù hợp**
    *   *Mô tả:* Duyệt danh sách các bác sĩ hàng đầu và chọn lịch khám trống thực tế.
    *   *Hành động khi Click:* Route trực tiếp tới `/all-doctor`.
*   **Bước 3: Hoàn tất Hồ sơ Bệnh án**
    *   *Mô tả:* Điền thông tin cá nhân, triệu chứng và địa chỉ liên lạc.
    *   *Hành động khi Click:* Mở ra một Modal Popup minh họa nhanh (Form Mockup) siêu đẹp tại chỗ để tạo cảm giác thực tế mà không bắt người dùng chuyển trang.
*   **Bước 4: Thanh toán & Nhận vé điện tử**
    *   *Mô tả:* Thực hiện thanh toán trực tuyến qua cổng PayOS an toàn với hệ thống khoá chống nhấn đúp (Double-Submit Lock).
    *   *Hành động khi Click:* Chuyển tiếp nhanh đến trang lịch sử đặt lịch `/my-booking` để bệnh nhân hình dung cách quản lý hóa đơn.

### Phân hệ 1.3: Quy trình khám bệnh tại cơ sở (On-Day Clinical Guide)
Hành trình thực tế của bệnh nhân tại bệnh viện/phòng khám vào ngày hẹn:
*   **Bước 1: Đến phòng khám đúng hẹn** -> Đến quầy lễ tân phòng khám trước 15 phút.
*   **Bước 2: Quét mã Check-in tự động** -> Mở QR Code/Vé điện tử trên BookingCare để nhân viên scan xác thực trong 3 giây.
*   **Bước 3: Gặp bác sĩ khám lâm sàng** -> Bác sĩ tiến hành thăm khám trực tiếp, chỉ định chụp chiếu nếu cần.
*   **Bước 4: Nhận Toa thuốc điện tử & Thanh toán** -> Kết quả khám và hóa đơn số sẽ lập tức gửi về tài khoản BookingCare của bệnh nhân (qua Remedy email và màn hình lịch sử khám).

### Phân hệ 1.4: Trung tâm Cá nhân & Trợ lý AI Gemini (Personalized Smart Hub)
*   *Trạng thái chưa đăng nhập:* Hiển thị một giao diện giới thiệu tính năng "Hồ sơ Sức khỏe điện tử" cực kỳ trực quan kèm nút bấm Đăng ký/Đăng nhập sang xịn (`#0071e3`, borderRadius 999px).
*   *Trạng thái đã đăng nhập:* Hiển thị Dashboard cá nhân: Cho biết lịch khám sắp tới (Active Appointment Countdown), số lần đã khám, và nút bấm mở nhanh bệnh án điện tử.
*   *Tích hợp Trợ lý AI Gemini:* Tích hợp khung chat thông minh hỏi đáp nhanh về triệu chứng sức khỏe và tự động liên kết gợi ý chuyên khoa tương ứng.

---

## IV. Sơ Đồ Thiết Kế Logic & Điều Hướng (Tab Quy Trình Đặt Khám)

Dưới đây là kiến trúc luồng hành động (Routing Flow) của **Component 1.2: Quy trình đặt khám tương tác**:

```mermaid
graph TD
    A[Bệnh nhân chọn Tab Quy trình đặt khám] --> B[Hiển thị Stepper 4 bước trực quan phong cách Apple]
    
    B --> C1[Bước 1: Khám phá Chuyên khoa/Dịch vụ]
    B --> C2[Bước 2: Chọn Bác sĩ & Lịch khám trống]
    B --> C3[Bước 3: Nhập thông tin bệnh án số]
    B --> C4[Bước 4: Thanh toán & Nhận vé QR]
    
    C1 -->|Click Nút Tương Tác| D1[Điều hướng sang: /select-service hoặc /all-specialty]
    C2 -->|Click Nút Tương Tác| D2[Điều hướng sang: /all-doctor]
    C3 -->|Click Nút Tương Tác| D3[Mở trực tiếp biểu mẫu điền nhanh dạng Mockup siêu đẹp tại chỗ]
    C4 -->|Click Nút Tương Tác| D4[Mở màn hình Lịch hẹn /my-booking hướng dẫn theo dõi hóa đơn]
```

---

## V. Gợi Ý Các "Wow Moments" (Tăng Trải Nghiệm & Chuyển Đổi)

1.  **Hiệu ứng "Sliding Pill Tab active":** Khi di chuyển chuột hoặc click đổi giữa 4 tab lớn, một dải nền mờ ảo (`rgba(210,210,215,0.4)`) có bo góc tròn mềm mại sẽ chạy trượt mượt mà (smooth sliding transition 0.3s) từ vị trí tab cũ sang vị trí tab mới, tạo cảm giác trơn tru như đang vuốt chạm trên hệ điều hành iOS.
2.  **Hiệu ứng "Bento Card Parallax Hover":** Khi rê chuột qua các khối hướng dẫn quy trình, thẻ card sẽ hơi nâng cao lên nhẹ dựa vào tỉ lệ khoảng cách của con trỏ chuột, đồng thời các đường viền siêu mảnh của thẻ sẽ ánh lên một dải màu mờ tinh tế.
3.  **Hiệu ứng Slide-over của Panel Chat:** Drawer chứa hội thoại với Bác sĩ sẽ trượt vào màn hình với cơ chế giảm tốc quán tính tự nhiên (`transition: transform 0.34s cubic-bezier(0.16, 1, 0.3, 1)`), đi kèm một lớp phủ bóng mờ nhẹ trên trang web phía dưới để tập trung sự chú ý của người dùng vào cuộc hội thoại.

---

## VI. Tối Ưu Hóa Kỹ Thuật (Hiệu Năng Cao & Mở Rộng)

*   **Tối ưu State để tránh Re-render diện rộng (Encapsulated State):**
    *   Toàn bộ trạng thái nhập liệu, di chuột hover, hoặc các bước trong sơ đồ Stepper sẽ được cô lập tuyệt đối bên trong từng Component con (`IntroductionComponent`, `BookingStepperComponent`, `ClinicalGuideComponent`, `PersonalDashboardComponent`, `DoctorChatDrawer`).
    *   Trang chủ cha (`HomePage.js`) chỉ giữ duy nhất một state `activeTab`. Điều này giúp việc thao tác bên trong các tab con **không làm kích hoạt cơ chế render lại toàn bộ trang chủ khổng lồ**, giữ tốc độ mượt mà tuyệt đối 60fps khi thao tác.
*   **Trì hoãn tải mã nguồn (Component Lazy Loading):**
    *   Áp dụng kỹ thuật tách nhỏ mã nguồn (Code Splitting) thông qua `React.lazy()` cho các phân hệ này. Các đoạn mã hiển thị giao diện chi tiết của quy trình khám bệnh hoặc Trợ lý ảo AI sẽ chỉ được tải về máy khách khi người dùng thực sự click vào tab đó lần đầu tiên, giảm tải dung lượng tải trang ban đầu (First Load Bundle) đi hơn 40%.
*   **API Bottleneck Prevention (Chống nghẽn cổ chai):**
    *   Dữ liệu tĩnh phục vụ các tab được định nghĩa cục bộ dưới dạng hằng số tĩnh (static constants) () hoặc được lưu trữ vào Redux store sau lần gọi đầu tiên, tránh gọi đi gọi lại API lên máy chủ NodeJS mỗi khi người dùng đổi tab qua lại.

---

## VII. Danh Sách Các Tập Tin Dự Kiến Sẽ Tạo Mới & Chỉnh Sửa (Cấu Trúc Thư Mục Cực Kỳ Nghiêm Ngặt)

### 1. File Chỉnh sửa (Modify)
*   [HomePage.js](file:///Users/pain.o4o4/Documents/SOURCE/fullstack/ReactJS/src/containers/HomePage/HomePage.js): Tích hợp quản lý state chuyển tab, render phân hệ tương tác, dọn dẹp các đoạn code thừa không còn phù hợp.
*   [HomePage.scss](file:///Users/pain.o4o4/Documents/SOURCE/fullstack/ReactJS/src/containers/HomePage/HomePage.scss): Tái lập cấu trúc lớp layout mới, chuyển giao diện sang phong cách Apple.
*   [HomeHeader.js](file:///Users/pain.o4o4/Documents/SOURCE/fullstack/ReactJS/src/containers/HomePage/HomeHeader.js): Thu nhỏ chiều cao của Banner (`hm-hero`), tối giản hóa cỡ chữ và responsive mượt mà cho banner. Thay thế nút "Hỗ trợ" thành nút "Chat / Liên hệ Bác sĩ" mở rộng state `isOpenDoctorChat`. Tích hợp gọi hiển thị `DoctorChatDrawer` cùng thư mục cấp cha.
*   [HomeHeader.scss](file:///Users/pain.o4o4/Documents/SOURCE/fullstack/ReactJS/src/containers/HomePage/HomeHeader.scss): CSS cho nút Chat mới trên Header và hỗ trợ căn chỉnh khoảng cách linh hoạt.

### 2. File Tạo mới (New)
*   **[Giao diện Chat Bác sĩ - THƯ MỤC CHA HOMEPAGE]** 
    *   `ReactJS/src/containers/HomePage/DoctorChatDrawer.js`: Slide-over panel kính mờ hiển thị danh sách bác sĩ trực tuyến và màn hình chat giả lập cao cấp (nằm cùng cấp với `HomeHeader.js` trong thư mục `HomePage`).
    *   `ReactJS/src/containers/HomePage/DoctorChatDrawer.scss`: Style cho Slide-over Panel chuẩn mờ kính Apple.
*   **[Giới thiệu - THƯ MỤC HOMETABS]** 
    *   `ReactJS/src/containers/HomePage/HomeTabs/IntroTab.js` & `IntroTab.scss`: Giao diện giới thiệu dạng lưới Bento cao cấp.
*   **[Quy trình đặt khám - THƯ MỤC HOMETABS]** 
    *   `ReactJS/src/containers/HomePage/HomeTabs/BookingFlowTab.js` & `BookingFlowTab.scss`: Giao diện Stepper tương tác, điều hướng thông minh.
*   **[Quy trình khám bệnh - THƯ MỤC HOMETABS]** 
    *   `ReactJS/src/containers/HomePage/HomeTabs/ClinicFlowTab.js` & `ClinicFlowTab.scss`: Giao diện hướng dẫn các bước thực tế tại cơ sở y tế.
*   **[Trung tâm cá nhân & AI - THƯ MỤC HOMETABS]** 
    *   `ReactJS/src/containers/HomePage/HomeTabs/PersonalDashboardTab.js` & `PersonalDashboardTab.scss`: Quản lý trạng thái đăng nhập, đếm ngược lịch khám sắp tới và tích hợp Gemini AI Chatbot thông minh.
Báo cáo anh/chị, em đã thực hiện đúng chỉ thị và cập nhật hoàn hảo tệp tin kế hoạch theo yêu cầu kiến trúc mới nhất!

Tệp tin kế hoạch chính đã được thiết lập trực tiếp tại workspace của anh/chị:

🏛️ Tóm tắt Kiến trúc & Phân tách Thư mục cực kỳ Nghiêm ngặt:
Phân cấp Component Chat (DoctorChatDrawer):
Vị trí: ReactJS/src/containers/HomePage/DoctorChatDrawer.js (và DoctorChatDrawer.scss).
Nguyên tắc: Nằm ở thư mục gốc HomePage, cùng cấp và trực thuộc quyền quản lý trực tiếp của HomeHeader.js. TUYỆT ĐỐI KHÔNG lọt vào thư mục HomeTabs.
Cách thức liên kết: Nút "Chat / Liên hệ Bác sĩ" tại HomeHeader.js sẽ gọi trực tiếp Drawer này qua State isOpenDoctorChat.
Cấu trúc 4 phân hệ Trang chủ cũ (HomeTabs):
Vị trí: Nằm gọn gàng trong thư mục con riêng biệt ReactJS/src/containers/HomePage/HomeTabs/.
Gồm 4 tab:
IntroTab.js (Bento Layout)
BookingFlowTab.js (Interactive Stepper)
ClinicFlowTab.js (Quy trình thực tế tại cơ sở)
PersonalDashboardTab.js (Dashboard cá nhân hóa & AI Gemini Chatbot)
🌟 Tính năng "Chat / Liên hệ Bác sĩ" hoạt động ra sao?
Giao diện mờ kính sang trọng (Frosted Slide-over Panel): Drawer sẽ trượt nhẹ nhàng ra từ góc phải với độ rộng 380px, áp dụng bộ lọc mờ kính cực mạnh backdrop-filter: blur(35px) và màu nền kính mờ trắng rgba(255, 255, 255, 0.72).
Danh sách bác sĩ động (Mockup tĩnh): Hiển thị danh bạ các bác sĩ nổi bật kèm chấm trạng thái Online màu xanh lá mượt mà.
Kịch bản hội thoại mẫu sinh động: Giả lập các tin nhắn tư vấn và phản hồi nhanh giữa Bác sĩ và Bệnh nhân giúp giao diện trực quan và thu hút hơn bao giờ hết.
IMPORTANT

Em đã hoàn tất toàn bộ khâu chuẩn bị tài liệu thiết kế. Tuyệt đối tuân thủ cam kết: Em đang dừng lại ở đây và CHỈ bắt đầu viết code khi nhận được lệnh "Đồng ý" hoặc "Duyệt plan" từ anh/chị!