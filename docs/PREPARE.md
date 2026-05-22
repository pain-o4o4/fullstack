BỘ GIÁO DỤC VÀ ĐÀO TẠO
TRƯỜNG ĐẠI HỌC THĂNG LONG
 
CHUYÊN ĐỀ TỐT NGHIỆP 
XÂY DỰNG HỆ THỐNG THÔNG TIN QUẢN LÝ ĐẶT LỊCH KHÁM BỆNH VÀ TƯ VẤN TRỰC TUYẾN THỜI GIAN THỰC
GIẢNG VIÊN HƯỚNG DẪN:	TS NGUYỄN DOÃN CƯỜNG
      ThS NGUYỄN HỮU TIẾN 
CHUYÊN NGÀNH: 	HỆ THỐNG THÔNG TIN
NHÓM THỰC HIỆN:	NHÓM 42A
  SINH VIÊN THỰC HIỆN: 	A45876 – TRẦN CHÍNH KIÊN
HÀ NỘI – 2026
MỤC LỤC
CHƯƠNG 1. GIỚI THIỆU	1
1.1. Phát biểu bài toán	1
1.2. Mục tiêu nghiên cứu	1
1.3. Đối tượng nghiên cứu	1
1.4. Phạm vi nghiên cứu	2
1.4.1. Phạm vi chức năng	2
1.4.2. Phạm vi công nghệ	2
1.4.3. Phạm vi triển khai	2
1.4.4. Giới hạn của đề tài	3
1.5. Phương pháp tiếp cận	3
1.6. Đóng góp dự kiến của khóa luận	3
1.7. Cấu trúc khóa luận	4
CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ  LIÊN QUAN	6
2.1. Tổng quan hệ thống thông tin	6
2.2. Các kiến trúc hệ thống sử dụng trong hệ thống quản lý	7
2.2.1. Kiến trúc Client – Server	7
2.2.2. Kiến trúc 3 – Tier	9
2.3. Các công nghệ và công cụ phát triển	10
2.3.1. Ngôn ngữ lập trình	10
2.3.2. Hệ quản trị cơ sở dữ liệu	11
2.3.3. Kiến trúc hệ thống và kết nối	12
2.3.4. Công cụ hỗ trợ phát triển	13
2.3.5. Ưu điểm của giải pháp công nghệ	13
2.4. Các hệ thống tương tự hệ thống quản lý đặt lịch khám	13
2.4.1. Khảo sát các hệ thống tương tự trong thực tế	13
2.4.2. Phạm vi của đề tài trong hệ thống HIS	14
2.5. Nhận xét và định hướng giải pháp	15
2.5.1. Nhận xét	15
2.5.2. Định hướng giải pháp	15
CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG	17
3.1. Phân tích yêu cầu hệ thống	17
3.1.1. Mô tả bài toán	17
3.1.2. Biểu đồ ngữ cảnh	19
3.1.3. Phân tích và thiết kế chức năng nghiệp vụ của hệ thống	20
3.1.4. Yêu cầu phi chức năng	24
3.2. Biểu đồ luồng dữ liệu	24
3.2.1. Biểu đồ luồng dữ liệu mức đỉnh	24
3.2.2. Biểu đồ luồng dữ liệu chức năng quản lý người dùng và hệ thống	27
3.2.3. Biểu đồ thể hiện chức năng quản lý danh mục	27
3.2.4. Biểu đồ thể hiện chức năng Quản lý lịch khám và nghiệp vụ	28
3.2.5. Biểu đồ thể hiện chức năng Dịch vụ bệnh nhân và đặt lịch	29
3.3. Mô hình use case	30
3.3.1. Sơ đồ use case quản lý đặt lịch khám bệnh	30
3.3.2. Mô tả chi tiết các tác nhân	30
3.3.3. Đặc tả use case	31
3.3.3.1. Phân rã use case bệnh nhân	31
3.3.3.1.1. Use case đăng ký tài khoản	31
3.3.3.1.2. Use case Xác thực OTP	32
3.3.3.1.3. Use case đăng nhập	34
3.3.3.1.4. Use case tìm kiếm bác sĩ	36
3.3.3.1.5. Use case xem chi tiết bác sĩ	38
3.3.3.1.6. Use case xem lịch khám bác sĩ	39
3.3.3.1.7. Use case đặt lịch khám	40
3.3.3.1.8. Use case xác nhận lịch khám qua Email	43
3.3.3.1.9. Use case thanh toán chi phí khám	45
3.3.3.1.10. Use case quản lý lịch sử khám bệnh	46
3.3.3.1.11. Use case cập nhật thông tin cá nhân	49
3.3.3.1.12. Use case xem chuyên khoa	50
3.3.3.1.13. Use case xem phòng khám	51
3.3.3.1.14. Use case xem cẩm nang sức khỏe	53
3.3.3.1.15. Use case tương tác ChatBox AI	55
3.3.3.1.16. Use case Chat trực tiếp với bác sĩ	56
3.3.3.2. Phân rã use case bác sĩ	58
3.3.3.2.1. Use case đăng nhập	58
3.3.3.2.2. Use case cập nhật thông tin cá nhân	59
3.3.3.2.3. Use case thiết lập lịch làm việc	61
3.3.3.2.4. Use case quản lý lịch khám	63
3.3.3.2.5. Use case xem danh sách bệnh nhân	64
3.3.3.2.6. Use case xác nhận lịch hẹn	66
3.3.3.2.7. Use case hòa tất khám bệnh	68
3.3.3.2.8. Use case gửi email kết quả khám	70
3.3.3.3. Phân ra use case quản trị viên	72
3.3.3.3.1. Use case đăng nhập	72
3.3.3.3.2. Use case quản lý tài khoản người dùng	74
3.3.3.3.3. Use case phân quyền người dùng	78
3.3.3.3.4. Use case quản lý thông tin bác sĩ	80
3.3.3.3.5. Use case quản lý chuyên khoa	82
3.3.3.3.6. Use case quản lý phòng khám	85
3.3.3.3.7. Use case quản lý cẩm nang	87
3.3.3.3.8. Use case quản lý lịch khám bác sĩ	89
3.3.3.3.9. Use case cập nhật thông tin bệnh nhân	91
3.3.3.4. Sơ đồ use case của bệnh nhân	1
3.3.3.5. Use case của bác sĩ	1
3.3.3.6. Use case của quản trị viên	2
3.4. Thiết kế cơ sở dữ liệu	3
3.4.1. Các loại dữ liệu mà hệ thống phần mềm sẽ tác nghiệp	3
3.4.2. Hệ cơ sở dữ liệu được thiết kế để triển khai hệ thống	4
3.4.2.1. Tổng quan hệ thống.	4
3.4.2.2. Kiến trúc hệ thống	4
3.4.3. Cấu trúc các bảng cơ sở dữ liệu của hệ thống quản lý đặt lịch khám	5
3.5. Phân tích thiết kế giao diện của hệ thống	14
3.5.1. Giao diện người dùng	14
3.5.1.1. Giao diện trang chủ đặt lịch	14
3.5.1.2. Giao diện trang đặt lịch	15
3.5.1.3. Giao diện trang ChatBox	16
3.5.1.4. Giao diện quản lý thông tin cá nhân và bảo mật	17
3.5.1.5. Giao diện quản lý lịch hẹn cá nhân	18
3.5.1.6. Giao diện quản lý lịch sử khám bệnh	19
3.5.2. Giao diện Quản trị viên	20
3.5.2.1. Giao diện chức năng quản lý người dùng	20
3.5.2.2. Giao diện quản lý bác sĩ	20
3.5.2.3. Giao diện quản lý cơ sở y tế	21
3.5.2.4. Giao diện quản lý chuyên khoa	22
3.5.2.5. Giao diện quản lý cẩm nang	23
3.5.2.6. Giao diện quản lý lịch khám của bác sĩ	24
3.5.2.7. Giao diện quản lý tin nhắn nhanh	25
3.5.2.8. Giao diện quản lý mẫu Email tự động	26
3.5.3. Giao diện bác sĩ	27
3.5.3.1. Giao diện quản lý bệnh nhân	27
CHƯƠNG 4. TRIỂN KHAI HỆ THỐNG  VÀ THỰC NGHIỆM	28
4.1. Môi trường triển khai hệ thống	28
4.1.1. Công cụ phát triển	28
4.1.2. Framework và công nghệ sử dụng	28
4.1.2.1. Backend – Node.js (ExpressJS)	28
4.1.2.2. Frontend – ReactJS	29
4.1.3. Hệ quản trị cơ sở dữ liệu	29
4.2. Cài đặt và triển khai hệ thống	30
4.3. Kiểm thử hệ thống	30
4.3.1. Kiểm thử đơn vị (Unit Test)	30
4.3.2. Kiểm thử tích hợp (Integration Testing)	30
4.3.3. Kiểm thử hệ thống (System Testing)	31

 
DANH MỤC BẢNG BIỂU, HÌNH ẢNH
Hình 2.1 . Quy trình hoạt động.	13
Hình 3.1 . Biểu đồ ngữ cảnh.	19
Hình 3.2 . Sơ đồ phân rã chức năng nghiệp vụ của hệ thống.	23
Hình 3.3 . Biểu đồ luồng dữ liệu mức đỉnh.	26
Hình 3.4 . Biểu đồ thể hiện chức năng quản lý người dùng và hệ thống.	27
Hình 3.5 . Biểu đồ thể hiện chức năng danh mục.	28
Hình 3.6 . Biểu đồ thể hiện chức năng quản lý lịch khám và nghiệp vụ.	29
Hình 3.7 . Biểu đồ thể hiện chức năng dịch vụ bệnh nhân và đặt lịch.	30
Hình 3.8 . Biểu đồ tuần tự đăng ký tài khoản bệnh nhân.	32
Hình 3.10 . Biểu đồ tuần tự xác thực OTP.	34
Hình 3.11 . Biểu đồ tuần tự đăng nhập.	36
Hình 3.12 . Biểu đồ tuần tự tìm kiếm bác sĩ.	37
Hình 3.13 . Biểu đồ tuần tự xem chi tiết bác sĩ.	39
Hình 3.14 . Biểu đồ tuần tự xem lịch khám bác sĩ.	40
Hình 3.15 . Biểu đồ tuần tự đặt lịch khám.	43
Hình 3.16 . Biểu đồ tuần tự xác nhận lịch khám qua email.	44
Hình 3.17 . Biểu đồ tuần tự thanh toán chi phí khám.	46
Hình 3.18 .  Biểu đồ tuần tự xem danh sách lịch khám.	48
Hình 3.19 . Biểu đồ tuần tự xem chi tiết lịch khám.	49
Hình 3.20 . Biểu đồ tuần tự cập nhật thông tin.	50
Hình 3.21 . Biểu đồ tuần tự xem chuyên khoa.	51
Hình 23 : Biểu đồ tuần tự xem phòng khám	52
Hình 3.23 . Biểu đồ tuần tự xem cẩm nang.	54
Hình 3.24 . Biểu đồ tuần tự tương tác ChatBox AI.	56
Hình 3.25 . Biểu đồ tuần tự Chat trực tiếp (Người - Người).	57
Hình 3.26 . Biểu đồ tuần tự đăng nhập của bác sĩ	59
Hình 3.27 . Biểu đồ tuần tự cập nhật thông tin cá nhân của bác sĩ.	61
Hình 3.28 . Biểu đồ tuần tự thiết lập lịch làm việc.	63
Hình 3.29 . Biểu đồ tuần tự quản lý lịch khám.	64
Hình 3.30 . Biểu đồ tuần tự xem danh sách bệnh nhân.	66
Hình 3.31 . Biểu đồ tuần tự xác nhận lịch hẹn.	68
Hình 3.32 . Biểu đồ tuần tự hoàn tất lịch khám.	70
Hình 3.33 . Biểu đồ tuần tự gửi email kết quả khám.	72
Hình 3.34 . Biểu đồ tuần tự đăng nhập của quản trị viên.	74
Hình 3.35 . Biểu đồ tuần tự xem danh sách người dùng.	75
Hình 3.36 . Biểu đồ tuần tự thêm người dùng mới.	76
Hình 3.37 . Biểu đồ tuần tự sửa thông tin người dùng.	77
Hình 3.38 . Biểu đồ tuần tự xóa người dùng.	78
Hình 3.39 . Biểu đồ tuần tự phân quyền người dùng.	80
Hình 3.40 . Biểu đồ tuần tự quản lý thông tin bác sĩ.	82
Hình 3.41 . Biểu đồ tuần tự quản lý chuyên khoa.	84
Hình 3.42 . Biểu đồ tuần tự quản lý phòng khám.	86
Hình 3.43 . Biểu đồ tuần tự quản lý cẩm nang.	88
Hình 3.44 . Biểu đồ tuần tự quản lý lịch khám bác sĩ.	91
Hình 3.45 . Biểu đồ tuần tự cập nhật thông tin bệnh nhân	93
Hình 3.46 . Use case bệnh nhân	1
Hình 3.47 . Use case bác sĩ.	1
Hình 3.48 . Use case quản trị viên.	2
Hình 3.49 . Biểu đồ quan hệ.	14
Hình 3.50 . Giao diện trạng chủ đặt lịch.	15
Hình 3.51 . Giao diện đặ.t lịch	16
Hình 3.52 . Giao diện ChatBox.	17
Hình 3.53 . Giao diện quản lý thông tin cá nhân và bảo mật.	18
Hình 3.54 . Giao diện quản lý lịch hẹn cá nhân.	19
Hình 3.55 . Giao diện quản lý lịch sử khám bệnh.	19
Hình 3.56 . Giao diện người dùng.	20
Hình 3.57 . Giao diện quản lý bác sĩ.	21
Hình 3.58 . Giao diện quản lý cơ sở y tế.	22
Hình 3.59 . Giao diện quản lý chuyên khoa.	23
Hình 3.60 . Giao diện quản lý cẩm nang.	24
Hình 3.61 . Giao diện quản lý khám của bác sĩ.	25
Hình 3.62 . Giao diện quản lý tin nhắn nhanh.	26
Hình 3.63 . Giao diện quản lý mẫu Email tự động	26
Hình 3.64 . Giao diện quản lý bệnh nhân.	27

 
LỜI MỞ ĐẦU
Trong những năm gần đây, sự phát triển mạnh mẽ của khoa học công nghệ, đặc biệt là công nghệ thông tin, chuyển đổi số và Internet of Things (IoT), đã tạo ra những thay đổi sâu rộng trong nhiều lĩnh vực của đời sống xã hội. Trong đó, ngành y tế là một trong những lĩnh vực chịu tác động rõ ràng nhất khi các hệ thống công nghệ ngày càng được ứng dụng nhằm nâng cao chất lượng dịch vụ và hiệu quả quản lý.
Hệ thống thông tin bệnh viện (HIS – Hospital Information System) đã và đang trở thành nền tảng quan trọng trong quá trình hiện đại hóa các cơ sở y tế. Trong vòng 10 năm qua, HIS không ngừng được phát triển với nhiều chức năng mở rộng như quản lý hồ sơ bệnh án điện tử, quản lý đặt lịch trực tuyến, tích hợp thanh toán trực tuyến, kết nối dữ liệu liên thông và hỗ trợ ra quyết định. Bên cạnh đó, sự kết hợp với các công nghệ mới như IoT cho phép thu thập dữ liệu sức khỏe theo thời gian thực, góp phần nâng cao khả năng theo dõi và chăm sóc bệnh nhân.
Tuy nhiên, mặc dù công nghệ đã có nhiều bước tiến đáng kể, thực tế nhiều bệnh viện và cơ sở y tế, đặc biệt là các cơ sở y tế vừa và nhỏ, việc quản lý khám chữa bệnh vẫn còn tồn tại nhiều hạn chế. Một trong những vấn đề phổ biến là quy trình đặt lịch khám bệnh chưa được tối ưu, vẫn phụ thuộc nhiều vào phương thức thủ công.
Có thể thấy rằng, bài toán xây dựng hệ thống quản lý đặt lịch khám bệnh không còn là một vấn đề mới. Tuy nhiên, trong bối cảnh chuyển đổi số hiện nay, đây vẫn là một hướng nghiên cứu và phát triển cần thiết, đặc biệt khi nhu cầu trải nghiệm người dùng và tối ưu hóa quy trình vận hành đang ngày càng tăng cao. Việc áp dụng các công nghệ hiện đại như nền tảng web, hệ thống phân tán và cơ sở dữ liệu quan hệ giúp giải quyết bài toán này một cách hiệu quả hơn.
Xuất phát từ những yêu cầu thực tiễn đó, đề tài “Xây dựng hệ thống thông tin quản lý đặt lịch khám bệnh và tư vấn trực tuyến thời gian thực” được thực hiện với mục tiêu nghiên cứu, thiết kế và phát triển một hệ thống hỗ trợ đặt lịch khám bệnh trực tuyến, góp phần nâng cao hiệu quả quản lý và chất lượng phục vụ trong lĩnh vực y tế.
 
LỜI CAM ĐOAN
Chúng em xin cam đoan rằng chuyên đề tốt nghiệp với đề tài “Xây dựng hệ thống thông tin quản lý đặt lịch khám bệnh và tư vấn trực tuyến thời gian thực” là kết quả nghiên cứu và làm việc của nhóm chúng em dưới sự hướng dẫn của giảng viên.
Em xin cam đoan chuyên đề tốt nghiệp này là công trình nghiên cứu và thực hiện của nhóm hai thành viên là Trần Chính Kiên và Vương Thế Anh dưới sự hướng dẫn chuyên môn của TS Nguyễn Doãn cường và ThS Nguyễn Hữu Tiến. 
Các nội dung nghiên cứu, kết quả đạt được trong đề tài là trung thực, không sao chép từ bất kỳ công trình nào khác. Những tài liệu tham khảo được sử dụng trong đề tài đều được trích dẫn rõ ràng theo quy định của nhà trường.
Chúng em chịu hoàn toàn trách nhiệm về tính trung thực và chính xác của các nội dung trong chuyên đề này. Nếu có bất kỳ sự gian lận nào, chúng em xin chịu trách nhiệm trước nhà trường và các quy định liên quan.
  Hà Nội, ngày 22 tháng 3 năm 2026
   Sinh viên thực hiện
  (Ký và ghi rõ họ tên)
  


  Trần Chính Kiên
 
LỜI CẢM ƠN
Trong thời gian thực hiện đề tài, em đã nhận được rất nhiều sự hỗ trợ, giúp đỡ và động viên từ các thầy cô.
Trước hết, em xin gửi lời cảm ơn chân thành đến thầy TS Nguyễn Doãn Cường – giảng viên hướng dẫn chính, người đã tận tình hướng dẫn, định hướng và góp ý cho em trong suốt quá trình thực hiện đề tài. Những kiến thức và kinh nghiệm mà thầy truyền đạt là nền tảng quan trọng giúp em hoàn thành đề tài này.
Em cũng chân thành cảm ơn thầy TS Phan Thanh Toàn và thầy ThS Nguyễn Hữu Tiến đã hỗ trợ, góp ý và chia sẻ những kinh nghiệm quý báu để em có cái nhìn toàn diện hơn trong quá trình thực hiện chuyên đề.
Bên cạnh đó, em cũng gửi lời cảm ơn đến các thầy cô trong khoa đã trang bị cho em những kiến thức quý báu trong suốt thời gian học tập tại trường. Đây chính là cơ sở giúp em có thể áp dụng vào việc nghiên cứu và phát triển hệ thống trong đề tài.
Cuối cùng, dù đã nỗ lực hết sức nhưng còn hạn chế về thời gian và kiến thức, bài làm khó tránh khỏi những thiếu sót. Em rất mong nhận được sự thông cảm và những ý kiến đóng góp của thầy cô để đề tài được hoàn thiện hơn.
Em xin chân thành cảm ơn!
 
PHÂN CHIA CÔNG VIỆC

STT	Thành viên	Công việc	Hoàn thành
1	Trần Chính Kiên			100%
2	Vương Thế Anh			100%
 
CHƯƠNG 1.	GIỚI THIỆU
1.1.	Phát biểu bài toán
Trong thời đại số hóa hiện nay, việc ứng dụng công nghệ thông tin quản lý bệnh viện không còn là điều quá mới mẻ mà đã trở thành yêu cầu bắt buộc nhằm nâng cao hiệu suất hoạt động. Đặc biệt, trong công tác khám chữa bệnh, việc quản lý lịch hẹn đóng vai trò quan trọng.
Hiện nay, tại nhiều bệnh viện, việc đặt lịch khám bệnh vẫn còn thực hiện theo phương thức truyền thống như đăng ký trực tiếp tại quầy hoặc qua điện thoại. Điều này dẫn đến nhiều hạn chế như: mất quá nhiều thời gian chờ đợi của bệnh nhân, quá tải tại quầy tiếp nhận, khó kiểm soát và phân bổ lịch khám hợp lý, dễ xảy ra sai sót trong quá trình ghi nhận thông tin.
Do đó, việc xây dựng một hệ thống quản lý đặt lịch khám bệnh được thực hiện nhằm nghiên cứu, thiết kế và phát triển một hệ thống hỗ trợ đặt lịch khám bệnh trực tuyến trên nền tảng web. Hệ thống hướng tới việc tối ưu hóa quá trình đăng ký khám bệnh, giảm thiểu thao tác thủ công, nâng cao hiệu quả quản lý và cải thiện chất lượng dịch vụ y tế.
Dưới đây là hình ảnh thể hiện tổng quát thực trạng hiện tại của quá trình truyền thống và giải pháp của hệ thống đặt lịch và tư vấn trực tuyến.
 
Ảnh 1: Tổng quan phát biểu bài toán
1.2.	Mục tiêu nghiên cứu
Mục đích của đề tài là xây dựng một hệ thống quản lý đặt lịch khám bệnh đáp ứng các yêu cầu sau:
-	Cho phép bệnh nhân đăng ký lịch khám trực tuyến.
-	Quản lý thông tin bệnh nhân một cách đầy đủ và chính xác.
-	Hỗ trợ nhân viên y tế trong việc sắp xếp lịch khám.
-	Giảm thiểu thời gian chờ đợi và nâng cao trải nghiệm người dùng.
-	Cung cấp các chức năng tra cứu, thống kê và báo cáo.
1.3.	Đối tượng nghiên cứu
Đối tượng nghiên cứu của đề tài là hệ thống quản lý đặt lịch khám bệnh trong môi trường bệnh viện hoặc phòng khám gồm:
-	Quy trình đặt lịch khám bệnh: từ khâu đăng ký, lựa chọn bác sĩ, chọn thời gian khám đến xác nhận lịch hẹn.
-	Dữ liệu và thông tin liên quan: thông tin bệnh nhân, bác sĩ, lịch khám, hồ sơ khám bệnh và thanh toán.
-	Các công nghệ phát triển hệ thống: ứng dụng web sử dụng Node.js, ReactJS và MySQL.
1.4.	Phạm vi nghiên cứu
1.4.1.	Phạm vi chức năng
Hệ thống bao gồm các chức năng chính:
-	Quản lý người dùng (bệnh nhân, bác sĩ, quản trị viên).
-	Quản lý thông tin bác sĩ, chuyên khoa và phòng khám.
-	Quản lý lịch làm việc của bác sĩ.
-	Cho phép bệnh nhân đặt lịch khám trực tuyến.
-	Quản lý lịch khám và trạng thái đặt lịch.
-	Lưu trữ thông tin khám bệnh.
-	Hỗ trợ thanh toán và đánh giá dịch vụ.
1.4.2.	Phạm vi công nghệ
Hệ thống được xây dựng dưới dạng ứng dụng web với frontend là ReactJS, backend là Node.js và database là MySQL. Hệ thống được triển khai ở mức prototype, phục vụ mục đích nghiên cứu và thử nghiệm.
1.4.3.	Phạm vi triển khai
-	Áp dụng cho bệnh viện  hoặc phòng khám quy mô nhỏ và vừa.
-	Không bao gồm tích hợp với các hệ thống y tế quốc gia hoặc hệ thống bảo hiểm.
-	Chưa triển khai các chức năng nâng cao như:
+	IoT y tế.
+	AI chẩn đoán.
+	Kết nối liên thông dữ liệu giữa các bệnh viện.
1.4.4.	Giới hạn của đề tài
-	Hệ thống tập trung vào chức năng đặt lịch, chưa bao phủ toàn bộ hệ thống HIS.
-	Chưa triển khai trên môi trường thực tế quy mô lớn.
-	Một số chức năng nâng cao chỉ dừng ở mức định hướng.
1.5.	Phương pháp tiếp cận
Để xây dựng hệ thống quản lý đặt lịch khám đáp ứng yêu cầu thực tế, đề tài áp dụng kết hợp các phương pháp tiếp cận trong phân tích, thiết kế và phát triển phần mềm:
-	Phương pháp khảo sát và phân tích yêu cầu: Việc khảo sát sẽ tập trung vào các hoạt động chính như tiếp nhận bệnh nhân, đăng ký khám, quản lý thông tin và tra cứu dữ liệu. Bên cạnh đó, tài liệu sẽ tham khảo các tài liệu liên quan nhằm xác định rõ yêu cầu hệ thống, những khó khăn của phương pháp thủ công và từ đó đề xuất giải pháp phù hợp.
-	Phương pháp phân tích và thiết kế hệ thống: Dựa vào kết quả khảo sát, hệ thống được phân tích và thiết kế theo hướng cấu trúc gồm: xác định các tác nhân tham gia hệ thống (bệnh nhân, bác sĩ, nhân viên, quản trị viên), xây dựng các chức năng chính của hệ thống, thiết kế mô hình dữ liệu và các bảng cơ sở dữ liệu, xây dựng sơ đồ chức năng và luồng dữ liệu.
-	Phương pháp phát triển phần mềm: Đề tài áp dụng kết hợp giữa mô hình WaterFall và phương pháp Agile (lặp lại và cải tiến) trong quá trình phát triển.
-	Phương pháp xây dựng và kiểm thử hệ thống: Hệ thống được triển khai dưới dạng prototype với các chức năng cốt lõi. Trong quá trình xây dựng cần tiến hành kiểm thử từng chức năng riêng lẻ, kiểm thử tích hợp giữa các module và đánh giá khả năng đáp ứng yêu cầu thực tế.
1.6.	Đóng góp dự kiến của khóa luận 
Đề tài được thực hiện với mục tiêu giới hạn trong Phân hệ tiếp đón và chăm sóc khách hàng trực tuyến (Thuộc bộ phận Front-office của hệ thống thông tin y tế HIS). Do đó, những đóng góp dự kiến của khóa luận được xác định cụ thể trong phạm vi sau:
-	Đóng góp về mặt phân tích và mô hình hóa:
+	Hệ thống hóa và số hóa thành công quy trình đặt lịch khám bệnh truyền thống thành một luồng nghiệp vụ trực tuyến khép kín: Tìm kiếm thông tin  -> Đặt lịch -> Thanh toán -> Xác nhận -> Trả kết quả.
+	Cung cấp một số bộ tài liệu phân tích hệ thống chuẩn xác (bao gồm các biểu đồ UML, luồng dữ liệu DFD, cơ sở dữ liệu ERD), có giá trị làm tài liệu thanh khảo để phát triển hệ thống chăm sóc khách hàng y tế có quy mô tương đương.
-	Đóng góp về mặt giải pháp phần mềm:
+	Xây dựng hoàn thiện một ứng dụng Web đóng vai trò như một nền tảng cầu nối, đảm bảo hoạt động trơn tru cho 3 đối tương người dùng cốt lõi: Quản trị viên, Bác sĩ, Bệnh nhân.
+	Nâng cao trải nghiệm khám bệnh thời đại số thông qua việc tích hợp thành công các tiện ích công nghệ hiện đại cào khâu tiếp đón: Cổng thanh toán quét mã QR (PayOS), xác thực bảo mật tài khoản qua mã OTP, hệ thống nhắn tin trực tiếp giữa bác sĩ – bệnh nhân, và Trợ lý ảo AI tư vấn sức khỏe sơ bộ.
-	Khả năng ứng dụng thực tiễn:
+	Sản phẩm của chuyên đề có thể được sử dụng làm phiên bản thử nghiệm hoặc triển khai ứng dụng thực tiễn cho các phòng khám tư nhân có quy mô vừa và nhỏ.
+	Đây là giải pháp tối ưu cho các cơ sở y tế chỉ có nhu cầu chuyển đổi số khâu tiếp đón, đặt hẹn và chăm sóc khách hàng từ xa, mà chưa cần đầu tư vào các phân hệ quản lý nội bộ phức tạp và đắt đỏ.


Dưới đây là hình ảnh trực quan hóa phần đóng góp dự kiến của khóa luận
 
Ảnh 2: Tổng quản các đóng góp dự kiến của chuyên đề
1.7.	Cấu trúc khóa luận
-	Chương 1: Trình bày lý do chọn đề tài, mục tiêu, phạm vi, các phương pháp tiếp cận và đóng góp chính của đề tài và cấu trúc tổng thể của báo cáo.
-	Chương 2: Giới thiệu về các khái niệm hệ thống thông tin, các kiến trúc hệ thống phổ biến, cũng như các công nghệ và công cụ được sử dụng trong quá trình phát triển.
-	Chương 3: Trình bày quá trình phân tích yêu cầu hệ thống, mô hình nghiệp vụ, thiết kế kiến trúc tổng quan, thiết kế cơ sở dữ liệu và giao diện người dùng của hệ thống quản lý đặt lịch khám.
-	Chương 4: Mô tả môi trường phát triển, quá trình cài đặt và triển khai hệ thống, các phương pháp kiểm thử và đánh giá hiệu suất hoạt động của hệ thống.
-	Chương 5: Tóm tắt các kết quả đạt được của đề tài, chỉ ra những hạn chế còn tồn tại và đề xuất hướng phát triển trong tương lai nhằm hoàn thiện và mở rộng hệ thống.
CHƯƠNG 2.	CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ 
LIÊN QUAN
2.1.	Tổng quan hệ thống thông tin
Hệ thống thông tin là tập hợp các thành phần bao gồm con người, phần mềm, phần cứng và dữ liệu, được tổ chức thu thập, xử lý và cung cấp thông tin phục vụ cho hoạt động quản lý và ra quyết định. Trong bối cảnh hiện nay, khi công nghệ thông tin phát triển mạnh mẽ, hệ thống thông tin đóng vai trò ngày càng quan trọng trong hầu hết lĩnh vực của đời sống, đặc biệt là trong ngành y tế - nơi yêu cầu cao về độ chính xác, tính kịp thời và khả năng xử lý dữ liệu lớn.
Trong lĩnh vực kinh tế, hệ thống thông tin không chỉ hỗ trợ quản lý dữ liệu bệnh nhân mà còn góp phần tối ưu hóa quá trình khám chữa bệnh và nâng cao chất lượng dịch vụ. Việc ứng dụng các hệ thống thông tin giúp các cơ sở y tế chuyển từ phương thức quản lý thủ công sang tự động hóa, từ đó hạn chế sai sót, tiết kiệm thời gian và nâng cao hiệu quả vận hành. Đồng thời, các hệ thống này còn hỗ trợ nhà quản lý trong việc thống kê, phân tích dữ liệu và đưa ra quyết định chính xác hơn.
Hiện nay, trong thực tế tồn tại nhiều loại hệ thống thông tin y tế khác nhau, mỗi hệ thống đảm nhiệm một vai trò riêng nhưng có mối liên hệ chặt chẽ với nhau. Trong đó, hệ thống thông tin bệnh viện (HIS) được xem là nền tảng trung tâm, hỗ trợ quản lý toàn bộ hoạt động của bệnh viện như quản lý bệnh nhân, khám chữa bệnh, viện phí và nhân sự. Bên cạnh đó, hệ thống hồ sơ bệnh án điện tử (EMR/EHR) cho phép lưu trữ và quản lý thông tin bệnh nhân theo thời gian, giúp bác sĩ dễ dàng theo dõi và hỗ trợ chẩn đoán.
Một thành phần quan trọng khác là hệ thống đặt lịch khám trực tuyến, cho phép bệnh nhân chủ động lựa chọn bác sĩ, nơi khám, thời gian khám và thực hiện đăng ký thông qua nền tảng web. Hệ thống này góp phần giảm tải cho bộ phận tiếp nhận, tối ưu hóa thời gian khám và nâng cao trải nghiệm người dùng. Ngoài ra, còn có các hệ thống chuyên biệt như hệ thống quản lý xét nghiệm (LIS) hỗ trợ lưu trữ và xử lý kết quả xét nghiệm, hay hệ thống lưu trữ và truyền tải hình ảnh y khoa (PACS) giúp quản lý các dữ liệu hình ảnh như X-quang, CT, MRI phục vụ chẩn đoán.
Các hệ thống thông tin y tế hiện đại thường không hoạt động mà được tích hợp với nhau thành một hệ sinh thái hoàn chỉnh. Trong đó HIS đóng vai trò trung tâm kết nối các hệ thống khác. Trong mô hình này, hệ thống đặt lịch đóng vai trò là điểm tiếp xúc đầu tiên giữa bệnh nhân và cơ sở y tế. Do đó, việc xây dựng và phát triển hệ thống quản lý đặt lịch khám bệnh không chỉ giải quyết nhu cầu thực tế mà còn là bước nền tảng để tiến tới xây dựng các hệ thống y tế thông minh, hiện đại và đồng bộ hơn trong tương lai.
2.2.	Các kiến trúc hệ thống sử dụng trong hệ thống quản lý
2.2.1.	Kiến trúc Client – Server
Client Server là dạng mô hình mạng máy tính có 2 thành phần chính là máy khách (client) và máy chủ (server). Máy chủ là nơi giúp lưu trữ tài nguyên cũng như cài đặt các chương trình dịch vụ theo đúng yêu cầu của máy khách. Ngược lại, máy khách bao gồm máy tính cũng như các loại thiết bị điện tử nói chung sẽ tiến hành gửi yêu cầu đến máy chủ.
Kiến trúc khách/chủ được thiết kế với sự phân tán công việc trên một mạng máy tính trong đó các máy khách có thể chia sẻ các dịch vụ của một máy chủ đơn lẻ. Một máy chủ là một ứng dụng phần mềm cung cấp các dịch vụ quản lý tập hay cơ sở dữ liệu, quản lý truyền thông …. Đối với các máy khách đang yêu cầu. Một máy khách là một ứng dụng phần mềm yêu cầu các dịch vụ từ một hay nhiều máy chủ. Thông thường, ứng dụng máy chủ được định vị trên một máy tính riêng trong mạng cục bộ đó.
Mục đích chính của các kiến trúc khách/chủ là cho phép các ứng dụng máy khách truy nhập dữ liệu được quản lý bởi máy chủ. Giao diện người dùng và logic của ứng dụng kinh doanh được xử lý trên máy khách, trong khi xử lý cơ sở dữ liệu được thực hiện trên máy chủ cơ sở dữ liệu.
Các hệ thống khách/chủ thường được sử dụng để hỗ trợ các tính toán theo một nhóm công việc, có nghĩa là việc sử dụng các tài nguyên tính toán để hỗ trợ quyết định và các ứng dụng khác với việc một nhóm người sử dụng. Một vài mạng như vậy có thể được móc nối với nhau sao cho các nhóm công việc khác nhau có thể chia sẻ công việc. Các hệ thống khách/chủ đang nhanh chóng phát triển thành các module lập sẵn cho các hệ thống tính toán quy mô toàn xí nghiệp tại nhiều tổ chức.
 
Ảnh 3: Kiến trúc hệ thống Client-Server
2.2.2.	Kiến trúc 3 – Tier 
Kiến trúc 3 lớp ra đời để phân chia các thành phần trong hệ thống đảm bảo hệ thống có tổ chức, vận hành hiệu quả. Các thành phần có cùng chức năng được nhóm lại và phân chia công việc cho từng nhóm để dữ liệu không chạy lộn xộn và không bị chồng chéo.
Thành phần chính của kiến trúc 3 lớp:
 
Ảnh 4: Thành phần của biểu đồ 3 lớp
Nguyên tắc cơ bản của một ứng dụng 3 lớp là luồng thông tin yêu cầu đi qua các tầng. Tùy thuộc vào công nghệ sử dụng, mỗi lớp có các cơ chế cho phép mỗi phần của kiến trúc giao tiếp với lớp liền kề khác:
-	Tương tác người dùng: người dùng tương tác với lớp GUI (VD: nhập dữ liệu vào biểu mẫu trên web hoặc nhập vào nút trên ứng dụng di động).
-	Xử lý yêu cầu: GUI gửi yêu cầu của người dùng đến BLL.
-	Logic nghiệp vụ: BLL thực thi các logic nghiệp vụ liên quan, xử lý dữ liệu  và có thể tương tác với tầng dữ liệu để truy xuất hoặc lưu trữ thông tin.
-	Truy cập dữ liệu: nếu cần, BLL sẽ giao tiếp với DAL để truy cập cơ sở dữ liệu, bằng cách đọc dữ liệu cần xử lý hoặc ghi dữ liệu để lưu trữ.
-	Phản hồi: BLL xây dựng phản hồi dựa trên dữ liệu đã được xử lý và các quy tắc nghiệp vụ, sau đó đóng gói phản hồi đó vào định dạng mà GUI yêu cầu.
-	Hiển thị: GUI nhận phản hồi từ BLL và hiển thị thông tin cho người dùng.
Ưu điểm của kiến trúc 3 lớp:
-	Phân loại rõ ràng các lớp với nhiệm vụ khác nhau giúp quản lý và duy trì dự án tốt hơn.
-	Phân loại dễ dàng các hành động tại Business.
-	Phân loại dễ dàng các hàm truy xuất tại Database, phân loại hàm theo table….
-	ứng dụng được cho các dự án lớn bên ngoài.
2.3.	Các công nghệ và công cụ phát triển 
2.3.1.	Ngôn ngữ lập trình
Hệ thống được phát triển theo mô hình ứng dụng web với hai thành phần trình:
-	Frontend: sử dụng ReactJS.
-	Backend: sử dụng Node.js.
Node.js là nền tảng chạy JavaScript phía Server, cho phép xây dựng các ứng dụng web có hiệu năng cao và khả năng xử lý nhiều kết nối đồng thời.
Ưu điểm của Node.js:
-	Xử lý bất đồng bộ (asynchronous), phù hợp với hệ thống có nhiều người dùng.
-	Tốc độ xử lý nhanh, hiệu quả.
-	Dễ dàng xây dựng API (RESTful API) để kết nối frontend và backend.
-	Hệ sinh thái phong phú với nhiều thư viện hỗ trợ.
Trong đề tài:
-	Xây dựng API quản lý bệnh nhân và lịch khám.
-	Xử lý logic nghiệp vụ của hệ thống.
-	Kết nối và thao tác với cơ sở dữ liệu.
ReactJS là thư viện JavaScript dùng để xây dựng giao diện người dùng (UI), đặc biệt phù hợp với các ứng dụng web hiện đại.
Ưu điểm của ReactJS:
-	Tái sử dụng component giúp phát triển nhanh với người dùng.
-	Dễ dàng quản lý trạng thái (state) của ứng dụng.
-	Giao diện động, phản hồi nhanh với người dùng.
-	Tăng trải nghiệm người dùng (UX).
Trong hệ thống, ReactJS được sử dụng để:
-	Xây dựng giao diện đặt lịch khám bệnh.
-	Hiển thị danh sách bệnh nhân và lịch khám.
-	Tương tác với API từ backend.
2.3.2.	Hệ quản trị cơ sở dữ liệu
Hệ thống áp dụng hệ quản trị cơ sở dữ liệu MySQL vì nó đặc biệt phù hợp với nhu cầu thực tế của dự án cũng như khả năng và kiến thức hiện tại của nhóm. Cụ thể, việc lựa chọn MySQL được quyết định dựa trên các ưu điểm nổi bật sau:
-	Phù hợp với cấu trúc dữ liệu của bài toán: Nền tản đặt lịch khám bệnh có nhiều thực thể mang tính ràng buộc chặt chẽ với nhau (ví dụ như: bệnh nhân – lịch khám – bác sĩ – chuyên khoa – phòng khám). MySQL là một hệ quản trị cơ sở dữ liệu quản hệ  mạnh mẽ, cung cấp cơ chế khóa chính và khóa ngoại hoàn hảo giúp duy trì tính toàn vẹn và nhất quản của dữ liệu.
-	Tương thích tốt với hẹ sinh thái công nghệ: Phía backend của hệ thống được xây dựng trên nền tảng Node.js kết hợp với thư viện ORM Sequelize. MySQL tương thích cực kỳ mượt mà với Sequelize, giúp quá trình thao tác, truy vấn dữ liệu và phiên bản cơ sở dữ liệu (Migration/Seeder) trở nên dễ dàng và tối ưu hơn.
-	Dễ dàng triển khai và sử dụng: MySQL rất thân thiện với người dùng mới bắt đầu, dễ dàng cài đặt trên máy cá nhân hoặc triên khai lên các môi trường như Docker, Hosting/VPS, mà không gặp nhiều khó khăn về mặt cấu hình. Điều này rất phù hợp với năng lực triển khai hiện tại của nhóm em.
-	Hiệu suất ổn định và miễn phí: MySQL là một mã nguồn mở hoàn toàn miễn phí, giúp nhóm tối ưu hóa được chi phí thực hiện đồ án. Đồng thời, MySQL vẫn đảm bảo được hiệu năng truy vấn nhanh, tính bảo mật cao và chịu tải tốt cho quy mô của một dự án web thực tế.
-	Cộng đồng hỗ trợ rộng lớn: Vì là một trong những cơ sở dữ liệu phổ biến nhất trên thế giới, MySQL có bộ tài liệu tham khảo khổng lồ. khi gặp các lỗi phát sinh hoặc cần tối ưu câu lên SQL, việc tìm kiếm giải pháp trên các cộng đồng lập trình rấ dễ dàng và nhanh chòng.
2.3.3.	Kiến trúc hệ thống và kết nối
Trong đề tài “Xây dựng hệ thống quản lý đặt lịch khám bệnh cho bệnh viện”, hệ thống được thiết kế dựa trên sự kết hợp giữa kiến trúc client-server và kiến trúc 3-Tier, nhằm tận dụng ưu điểm của cả hai mô hình để đảm bảo hiệu quả, tính linh hoạt và khả năng mở rộng. Trong đó:
-	Client (ReactJS): giao diện người dùng.
-	Server (Node.js): xử lý nghiệp vụ và API.
-	Database (MySQL): lưu trữ dữ liệu.
Việc kết hợp hai kiến trúc này mang lại nhiều lợi ích cho hệ thống. Mô hình client-Server giúp đơn giản hóa quá trình giao tiếp giữa người dùng và hệ thống, trong khi kiến trúc 3-Tier giúp tách biệt rõ ràng các thành phần, từ đó nâng cao khả năng bảo trì, mở rộng và phát triển hệ thống trong tương lai. Ngoài ra, cách tiếp cận này còn tạo tiền đề để hệ thống có thể chuyển đổi sang kiến trúc Microservices khi quy mô và yêu cầu phát triển tăng cao.
 
Hình 2.1. Quy trình hoạt động.
2.3.4.	Công cụ hỗ trợ phát triển 
Ngoài các công nghệ chính, đề tài còn sử dụng một số công cụ hỗ trợ:
-	Visual Studio Code: môi trường lập trình.
-	Postman: kiểm thử API.
-	Git/GitHub: quản lý mã nguồn.
-	MySQL Workbench / phpmyAdmin: quản lý cơ sở dữ liệu.
2.3.5.	So sánh lựa chọn công nghệ
Dưới dây là các lý do lựa chọn công nghệ để phù hợp với yêu cầu của hệ thống và kiến thức hiện tại của bọn em.
Ảnh 5: So sánh lựa chọn công nghệ
2.4.	Các hệ thống tương tự hệ thống quản lý đặt lịch khám
2.4.1.	Khảo sát các hệ thống tương tự trong thực tế
Trong lĩnh vực y tế số, ngoài các nền tảng trung gian như BookingCare, các cơ sở y tế (Bệnh viên, phòng khám lớn) thường sử dụng một hệ thống quản lý tổng thể và đồ sộ được gọi là HIS (Hospital Ifnormation System – Hệ thống thông tin bệnh viện). Hệ thống HIS được thiết kế để quản lý toàn diện mọi hoạt động của một cơ sở y tế, bao gồm các phân hệ (module) chính dưới đây:

Ảnh 6: Sơ đồ cấu trúc hệ thống HIS
2.4.2.	Phạm vi của đề tài trong hệ thống HIS
Có thể thấy, một hệ thống HIS tiêu chuẩn là một phần mềm khổng lồ và phức tạp, bao phủ toàn bộ vòng đời của bệnh nhân khi bước vào bệnh viện.
Tuy nhiên, trong một hệ thống HIS rộng lớn như vậy, hệ thống của nhóm em đang phát triển nằm trong phạm vi của “Phân hệ Quản lý tiếp đón và Đăng ký khám bệnh”. Cụ thể hơn, thay vì giải quyết khâu tiếp đón trực tiếp tại quầy (truyền thống), đề tài của chúng em tập trung chuyên sâu vào giải pháp Đăt lịch khám bệnh trực tuyến (online Booking).
Lý do lựa chọn thu hẹp phạm vi: Việc tập trung hoàn toàn vào luồng Đặt lịch online (Giống mô hình BookingCare) thay vì làm một hệ thống HIS hoàn chỉnh giúp nhóm giải quyết triệt để một vấn đề lớn nhất của cả bệnh viện và bệnh nhân hiện nay: Tình trạng quá tải, chờ lấy số mệt mỏi tải sảnh chờ. Hệ thống của nhóm em giúp:
-	Đưa khâu đăng ký khám bệnh từ “offline” lên “online”, giúp bệnh nhân chu động thời gian chọn bác sĩ và giờ khám tại nhà.
-	Số hóa toàn bộ luồng thông tin người bệnh trước khi họ đến cơ sở y tế.
-	Tích hợp sâu các tiện ích mởi rộng phục vụ việc ra quyết định của bệnh nhân (như ChatBox AI hỗ trợ tra cứu, thanh toán trực tuyến) – những tính năng mà các hệ thống HIS nội bộ thường ít chú trọng bằng trải nghiệm người dùng (UX/UI).
Do đó, việc khoan vùng đề tài vào “Hệ thống đặt lịch khám trực tuyến” là một hướng đi thực tế, vừa vặn với thời gian thực hiện chuyên đề, đồng thời đáp ứng đúng xu thế chuyển đổ số y tế hiện nay.
2.5.	Nhận xét và định hướng giải pháp
2.5.1.	Nhận xét
-	Việc áp dụng công nghệ thông tin vào quản lý khám chữa bệnh là xu hướng tất yếu.
-	Các hệ thống tuy mạnh như chưa thật sự phù hợp với mô hình vừa và nhỏ.
-	Nhu cầu đặt lịch khám trực tuyến ngày càng tăng.
-	Người dùng ưu tiên các hệ thống đơn giản, dễ dàng sử dụng và nhanh chóng.
2.5.2.	Định hướng giải pháp 
Đề tài định hướng xây dựng hệ thống với các đặc điểm:
-	Xây dựng hệ thống quản lý đặt lịch khám bệnh tập trung: cho phép quản lý toàn bộ thông tin bệnh nhân và lịch khám trên một nền tảng thống nhất.
-	Ứng dụng công nghệ web hiện đại (Node.js – ReactJS – MySQL): đảm bảo hệ thống hoạt động nhanh, ổn định và có khả năng mở rộng.
-	Thiết kế giao diện thân thiện với người dùng: giúp bệnh nhân dễ dàng thao tác đặt lịch, tra cứu thông tin.
-	Tối ưu hóa quy trình đặt lịch khám: giảm thời gian chờ đợi, hạn chế sai sót và nâng cao hiệu quả làm việc của nhân viên y tế.
-	Đảm bảo tính bảo mật và toàn vẹn dữ liệu: thông tin bệnh nhân được lưu trữ an toàn và có kiểm soát truy cập.
CHƯƠNG 3.	PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
3.1.	Phân tích yêu cầu hệ thống
3.1.1.	Mô tả bài toán 
Trong thực tế quy trình đăng ký và khám chữa bệnh tại các bệnh viện thường diễn ra theo nhiều bước thủ công, gây mất thời gian và khó kiểm soát. Do đó, hệ thống quản lý đặt lịch khám bệnh được xây dựng nhằm số hóa và tối ưu toàn bộ quy trình này. 
Quy trình nghiệp vụ hệ thống được chia làm 6 bước chính như sau:
Ảnh 7: Quy trình nghiệp vụ của hệ thống
3.1.2.	Biểu đồ ngữ cảnh
Bước đầu tiên trong việc phân tích thiết kế hệ thống là cần làm rõ được các đối tượng tham gia vào hệ thống, cũng như mối liên kết giữa các đối tượng với nhau. Đối với một hệ thống quản lý đặt lịch khám bệnh, có thể xác định các đối tượng chính sau đây tham gia vào các hoạt động của hệ thống:
-	Bệnh nhân: Đây là một đối tượng người dùng không thể thiếu trong hệ thống quản lý đặt lịch khám bệnh. Sử dụng hệ thống để đăng ký, đặt lịch khám và theo dõi thông tin khám bệnh.
-	Bác sĩ: đây là đối tượng sử dụng hệ thống để quản lý lịch làm việc và xem danh sách bệnh nhân đã đăng ký khám.
-	Quản trị viên: đây là người quản lý toàn bộ hệ thống, dữ liệu và người dùng. 
-	Hệ thống đặt lịch khám chữa bệnh: đây là đối tượng trung gian, nhằm thực hiện việc kết nối thông tin giữa bệnh nhân và bác sĩ. Hệ thống đóng vai trò trung gian xử lý và lưu trữ dữ liệu giữa bệnh nhân và bác sĩ.
 
Hình 3.1. Biểu đồ ngữ cảnh.
3.1.3.	Phân tích và thiết kế chức năng nghiệp vụ của hệ thống
Từ mô tả bài toán và qua quá trình khảo sát quy trình của hệ thống quản lý lịch khám bệnh ta cần xây dựng những chức năng sau:
1. Quản lý người dùng và hệ thống
1.1	Xác thực và đăng nhập
Quản lý quy trình đăng nhập an toàn, cấp phát token (JWT). Ngoài ra, hỗ trợ người dùng mới đăng ký tài khoản và xác minh danh tính hoặc khôi phục mật khẩu thông qua việc gửi mã OTP (One Time Password)..
1.2	Quản lý tài khoản 
Quản trị viên có thể xem danh sách, thêm mới, chỉnh sửa thông tin (tên, SĐT, địa chỉ, ảnh) và xóa (CRUD) các tài khoản người dùng trong hệ thống.
1.3	Phân quyền hệ thống
Thiết lập và thay đổi vai trò (Role) cho tài khoản (Quản trị viên, Bác sĩ, Bệnh nhân). Hệ thống sẽ dựa vào vai trò này để cấp quyền truy cập các chức năng tương ứng theo cơ chế Role-Based Access Control (RBAC).
1.4	Quản lý hồ sơ cá nhân 
Cho phép người dùng đã đăng nhập tự cập nhật thông tin cá nhân của mình, đổi mật khẩu và cập nhật ảnh đại diện.
2. Quản lý danh mục
2.1. Quản lý chuyên khoa
Tạo mới, cập nhật, xóa các chuyên khoa y tế. Thông tin bao gồm tên chuyên khoa, hình ảnh đại diện và bài viết mô tả chi tiết bằng Markdown/HTML.
2.2. Quản lý phòng khám
Quản lý danh sách các cơ sở y tế/phòng khám hợp tác. Bao gồm tên, địa chỉ thực tế, hình ảnh và bài viết giới thiệu.
2.3. Quản lý Hồ sơ Bác sĩ
Xây dựng thông tin chi tiết cho từng bác sĩ: bài viết giới thiệu chuyên môn, gán phòng khám làm việc, chuyên khoa, thiết lập giá khám, phương thức thanh toán và bảo hiểm hỗ trợ.
2.4. Quản lý cẩm nang
Xây dựng các bài viết chia sẻ kiến thức y tế, y học thường thức để xuất bản lên trang chủ cho người dùng đọc.
3. Quản lý lịch khám và nghiệp vụ
3.1. Thiết lập lịch làm việc 
Bác sĩ hoặc Admin tạo các ca làm việc bằng cách chọn ngày, chọn phòng khám và đánh dấu các khung giờ sẽ mở nhận bệnh nhân. Hệ thống sẽ cấp phát số lượng khám tối đa cho từng khung giờ.
3.2. Quản lý danh sách bệnh nhân
Hiển thị danh sách các bệnh nhân đã đặt lịch cho một ngày cụ thể của bác sĩ. Tự động sắp xếp mức độ ưu tiên (Đã xác nhận > Đã khám > Quá hạn) và dọn dẹp các lịch ảo, lịch hết hạn.
3.3. Cập nhật trạng thái khám
Bác sĩ ghi nhận tiến trình khám của bệnh nhân, từ "Đã xác nhận" sang "Đã khám xong" (Hoàn thành), hoặc hủy bỏ nếu có lý do.
3.4. Trả kết quả khám
Sau khi khám xong, hệ thống tự động soạn thảo và gửi email kết quả khám bệnh, lời cảm ơn và dặn dò đến email của bệnh nhân (Hỗ trợ song ngữ Anh/Việt).
4. Dịch vụ bệnh nhân 
4.1. Tra cứu thông tin y tế 
Cho phép người dùng tìm kiếm, xem danh sách và đọc chi tiết hồ sơ các bác sĩ nổi bật, các chuyên khoa, phòng khám và bài viết cẩm nang.
4.2. Đặt lịch khám bệnh
Cốt lõi của hệ thống: Bệnh nhân chọn bác sĩ, ngày khám, khung giờ trống, điền thông tin cá nhân và lý do khám. Hệ thống tự động kiểm tra trùng lịch và khóa slot an toàn.
4.3. Xác nhận qua email
Hệ thống gửi link xác nhận bí mật qua email. Bệnh nhân bắt buộc phải click để xác thực danh tính nhằm ngăn chặn spam lịch ảo.
4.4. Thanh toán chi phí (PayOS)
Tích hợp cổng thanh toán PayOS để bệnh nhân thanh toán trước phí khám. Hệ thống nhận Webhook tự động cập nhật trạng thái "Đã xác nhận" và xuất biên lai qua email.
4.5. Quản lý lịch hẹn cá nhân
Khu vực quản lý riêng của bệnh nhân, bao gồm các chức năng: Lịch khám của tôi (My Booking), Lịch sử khám bệnh (Booking History), và xem chi tiết tiến độ các cuộc hẹn trước đây cũng như hiện tại.
4.6. Trợ lý ảo AI Chatbot
Tính năng tương tác hiện đại. Bệnh nhân có thể mở cửa sổ ChatBox để được chat với Trợ lý ảo AI quả xử lý ngôn ngữ tự nhiên để được tư vấn sơ bộ về triệu chứng, hỏi đường và hướng dẫn đặt lịch.
4.7. Chat trực tiếp với bác sĩ
Tính năng giúp bệnh nhân có thể tương tác trực tiếp với bác si qua tinh nhắn và hình ảnh để hỏi về các triệu chứng.
 
Hình 3.2. Sơ đồ phân rã chức năng nghiệp vụ của hệ thống.
3.1.4.	Yêu cầu phi chức năng
-	Hiệu năng: hệ thống xử lý nhanh, đáp ứng nhiều người dùng đồng thời 
-	Bảo mật: bảo vệ thông tin cá nhân và dữ liệu y tế. Phân quyền rõ ràng giữa các vai trò
-	Tính sẵn sàng: hệ thống hoạt động ổn định, hạn chế lỗi
-	Khả năng mở rộng: dễ dàng nâng cấp và thêm chức năng 
-	Tính dễ sử dụng: giao diện người dùng thân thiện, dễ dàng thao tác
3.2.	Biểu đồ luồng dữ liệu
3.2.1.	Biểu đồ luồng dữ liệu mức đỉnh
Mô hình mức định thể hiện hệ thống quản lý đặt lịch khám bệnh như một tiến trình tổng thể, tương tác với các tác nhân bên ngoài gồm bệnh nhân, bác sĩ và quản trị viên.
Hệ thống có 5 kho dữ liệu chính:
-	D1. Tài khoản User: bảng User, lưu trữ thông tin đăng nhập, vai trò (role), thông tin cá nhân cơ bản.
-	D2. Danh mục Y tế: Bảng Specialties, Clinics, Handbooks và bảng Allcodes. Lưu trữ các dữ liệu nền tảng tĩnh.
-	D3. Hồ sơ bác sĩ: Bảng Doctor_infor và Markdowns. Lưu trữ giá khám, phương thức thanh toán, bài viết giới thiệu.
-	D4. Lịch làm việc: Bảng Schedules. Lưu trữ số lượng slot trống của bác sĩ theo từng khung giờ và ngày.
-	D5. Lịch hẹn booking: Bảng Bookings. Lưu chi tiết các đơn đặt khám và trạng thái (Từ S1 đến S5). 
Các tiến trình và luồng dữ liệu 
-	Tiến trình 1: Quản lý người dùng
+	Tiếp nhận yêu cầu đăng ký từ bệnh nhân, tạo mới tài khoản từ quản trị viên, và cập nhật hồ sơ từ tất cả các bênh.
+	Ghi dữ liệu vào kho D1. Trả về Token xác thực cho các thao tác tiếp theo
-	Tiến trình 2: Quản lý danh mục
+	Quản trị viên dẩy dữ liệu về chuyên khoa, phòng khám, cẩm nang vào hệ thống để lưu tại khoa D2.
+	Bác sĩ và Quản trị viên cùng thiết lập các thông tin khám bệnh (giá, bảo hiểm) và bìa viết chuyên môn, lưu vào kho D3.
-	Tiến trình 3: Quản lý lịch khám và nghiệp vụ
+	Bác sĩ đẩy thông tin về thời gian rảnh rỗi lên hệ thống. Hệ thống tạo các slot trống tại kho D4.
+	Bác sĩ kéo theo danh sách bệnh nhân từ kho D5, sau đó tiến hàng khám và đẩy lệnh cập nhật trạng thái “Đã khám xong” ngược vào D5.
+	Tiến trình này tự động xuất email kết quả trả về cho bệnh nhân.
-	Tiến trình 4: Dịch vụ Bệnh nhân và Đặt lịch
+	Bệnh nhân gửi tiêu chí tìm kếm. Tiến trình kéo dữ liệu từ D2, D3, D4 để hiển thị giao diện danh sách bác sĩ và giờ trống.
+	Bệnh nhân đẩy form đặt lịch (thông tin, lý do khám). Tiến trình sinh ra lịch hẹn mới trong D5.
+	Tiến trình giao tiếp với cổng PayOS để xử lý thanh toán, sau đó gửi Email yêu cầu xác nhận về cho bệnh nhân để chốt lịch hẹn.
 
 
Hình 3.3. Biểu đồ luồng dữ liệu mức đỉnh. 

  
3.2.2.	Biểu đồ luồng dữ liệu chức năng quản lý người dùng và hệ thống
Sau khi đăng nhập vào hệ thống, bệnh nhân và bác sĩ có thể chủ động thay đổi mật khẩu nhằm tăng cường tính bảo mật và quyền riêng tư cá nhân. Trong khi đó, quản trị viên (Admin) được cấp quyền cao nhất để thực hiện phân quyền, quản lý toàn bộ danh sách tài khoản người dùng và thiết lập các cấu hình cốt lõi của hệ thống.
 
Hình 3.4. Biểu đồ thể hiện chức năng quản lý người dùng và hệ thống.
3.2.3.	Biểu đồ thể hiện chức năng quản lý danh mục
Quản trị viên chịu trách nhiệm chính trong việc xây dựng và duy trì các dữ liệu nền tảng cốt lõi của hệ thống bao gồm: chuyên khoa, phòng khám và bài viết cẩm nang y tế. Đồng thời, hệ thống cung cấp cơ sở để quản trị viên và bác sĩ phối hợp thiết lập thông tin chi tiết về hồ sơ khám bệnh, giá cả và bảo hiểm, từ đó tạo nên cơ sở dữ liệu y tế toàn diện phục vụ người bệnh.
 
Hình 3.5. Biểu đồ thể hiện chức năng danh mục.
3.2.4.	Biểu đồ thể hiện chức năng Quản lý lịch khám và nghiệp vụ
Bác sĩ làm chủ quá trình tác nghiệp bằng việc thiết lập thời gian làm việc linh hoạt và theo dõi danh sách bệnh nhân đặt lịch hàng ngày. Hệ thống hỗ trợ tối đa nghiệp vụ y tế thông qua cơ chế tự động dọn dẹp các lịch hẹn ảo, cho phép bác sĩ dễ dàng cập nhật trạng thái "đã khám" và tự động gửi email đính kèm kết quả chẩn đoán đến tận tay bệnh nhân một cách nhanh chóng, bảo mật.
 
Hình 3.6. Biểu đồ thể hiện chức năng quản lý lịch khám và nghiệp vụ.
3.2.5.	Biểu đồ thể hiện chức năng Dịch vụ bệnh nhân và đặt lịch
Mọi trải nghiệm của bệnh nhân được tối ưu hóa từ bước tra cứu thông tin bác sĩ, chuyên khoa đến việc lựa chọn khung giờ khám phù hợp. Quy trình đặt lịch được gắn kết chặt chẽ với cổng thanh toán an toàn (PayOS) và hệ thống xác minh danh tính qua email hai lớp, giúp bệnh nhân an tâm giao dịch đồng thời dễ dàng theo dõi toàn bộ lịch sử khám bệnh cá nhân của mình.
 
Hình 3.7. Biểu đồ thể hiện chức năng dịch vụ bệnh nhân và đặt lịch.
3.3.	Mô hình use case
3.3.1.	Sơ đồ use case quản lý đặt lịch khám bệnh
3.3.2.	Mô tả chi tiết các tác nhân
Hệ thống bao gồm 3 tác nhân nội bộ và 2 tác nhân bên ngoài:
-	Bệnh nhân (Patient): Người dùng có nhu cầu tìm kiếm thông tin y tế, đặt lịch khám và tương tác với các tiện ích của hệ thống.
-	Bác sĩ (Doctor): Người dùng tiếp nhận bệnh nhân, thiết lập lịch trống và trả kết quả khám.
-	Quản trị viên (Admin): Người dùng quản lý hệ thống, kiểm soát dữ liệu người dùng, phòng khám, chuyên khoa và cẩm nang y tế.
-	Hệ thống PayOS: Tác nhân bên ngoài cung cấp dịch vụ công thanh toán quét mã QR.
-	Hệ thống Email: Tác nhân bên ngoài chịu trách nhiệm gửi mã OTP, link xác nhận đặt lịch và hóa đơn/kết quả bệnh án.
-	AI Server: Tác nhân bên ngoài chịu trách nhiệm suy luận và trả lời các câu hỏi của bệnh nhân
3.3.3.	Đặc tả use case
3.3.3.1.	Phân rã use case bệnh nhân
3.3.3.1.1.	Use case đăng ký tài khoản
Mục	Nội dung
Tác nhân	Bệnh nhân, Hệ thống Email (Actor phụ)

Mô tả	Bệnh nhân đăng ký tài khoản mới. Để dảm bảo email là chính chủ, hệ thống gửi một mã OTP gồm 4 số. Bệnh nhân cần nhập đúng mã này để kịch hoạt tài khoản
Tiền điều kiện	Bệnh nhân điền đầy dủ email, mật khẩu không trùng lặp.
Hậu điều kiện	Hồ sơ tài khoản bệnh nhân được khởi tạo trên hệ thống
-	Luồng chính:
1. Bệnh nhân truy cập biểu mẫu Đăng ký.
2. Bệnh nhân điền các thông tin liên hệ: email, mật khẩu, họ tên, địa chỉ, số điện thoại, giới tính.
3. Hệ thống đối chiếu xem email này đã tồn tại hay chưa.
4. Hệ thống áp dụng cơ chế bảo mật để mã hóa mật khẩu trước khi lưu.
5. Hồ sơ tài khoản mới được tạo lập với quyền hạn là Bệnh nhân.
6. Trả về thông báo đăng ký thành công.
-	Luồng ngoại lệ:
3a. Email đã tồn tại → Hệ thống cảnh báo: "Email này đã được sử dụng".
2a. Bỏ trống các mục bắt buộc → Yêu cầu bệnh nhân điền đầy đủ thông tin.
 
Hình 3.8. Biểu đồ tuần tự đăng ký tài khoản bệnh nhân.
3.3.3.1.2.	Use case Xác thực OTP
Mục	Nội dung
Tác nhân	Bệnh nhân, Hệ thống Email
Mô tả	Đảm bảo địa chỉ email đăng ký của bệnh nhân là có thật và thuộc quyền sở hữu của họ thông qua việc xác minh mã OTP
Tiền điều kiện	Bệnh nhân đã đăng ký tài khoản nhưng tài khoản đang ở trạng thái “Chưa kích hoạt”
-	Luồng chính:
1. Bệnh nhân chọn yêu cầu gửi mã OTP xác thực trên giao diện.
2. Giao diện gửi yêu cầu lấy mã OTP đến Hệ thống.
3. Hệ thống tạo ra một mã OTP ngẫu nhiên yêu cầu Database lưu mã này vào thông tin tài khoản của bệnh nhân.
4. Database xác nhận lưu mã OTP thành công.
5. Hệ thống yêu cầu Hệ thống Email gửi thư đến hòm thư của bệnh nhân.
6. Hệ thống email thực hiện gửi thư đến hòm thư của Bệnh nhân.
7. Hệ thống thông báo cho giao diện ràng mã OTP đã được phát hành. Giao diện hiển thị thông báo yêu cầu Bệnh nhân kiểm tra email.
8. Bệnh nhân nhập mã OTP nhận được vào Giao diện cà nhấn xác nhận.
9. Giao diện gửi yêu cầu xác thực mã OTP đến Hệ thống.
10. Hệ thống yêu cầu database truy vấn mã OTP của tài khoản hiện tại.
11. Database trả về kết quả của mã đã lưu.
12. Hệ thống kiểm tra thấy mã OTP hợp lệ và chưa hết hạn. Hệ thống yêu cầu database cập nhật thông tin tài khoản sang trạng thái “Đã kích hoạt”.
13. Database xác nhận cập nhật thành công.
14. Hệ thống trả về kết quả thành công về giao diện. Giao diện hiển thị thông báo hoàn thành và chuyển hướng bệnh nhân.
-	Luồng ngoại lệ:
12a. Nếu mã OTP bệnh nhân nhập vào không khớp với Database hoặc đã hết hạn thời gian hiệu lực: Hệ thống thông báo lỗi về giao diện. Giao diện  hiển thị cảnh báo “Mã OTP sai hoặc hết hạn” và yêu cầu bệnh nhân nhập lại.
 
Hình 3.10. Biểu đồ tuần tự xác thực OTP.
3.3.3.1.3.	Use case đăng nhập
Mục	Nội dung
Tác nhân	Bệnh nhân
Mô tả	Bệnh nhân truy cập vào tài khoản cá nhân để thực hiện các giao dịch đặt lịch
Tiền điều kiện	Bệnh nhân đã đăng ký tài khoản thành công
Hậu điều kiện	Hệ thống ghi nhận trạng thái đăng nhập hợp lệ
-	Luồng chính:
1. Bệnh nhân nhập email và mật khẩu
2. Hệ thống kiểm tra sự tồn tại của tài khoản.
3. Hệ thống đối chiếu tính hợp lệ của mật khẩu.
4. Khởi tạo một phiên làm việc an toàn để bệnh nhân không phải đăng nhập lại nhiều lần.
5. Cho phép bệnh nhân truy cập vào bảng điều khiển cá nhân.
-	Luồng ngoài lệ :
2a. Email không tồn tại  → errCode: 1 "Your email doesn't exist"
3a. Sai mật khẩu → errCode: 2 "Wrong password!"
 
Hình 3.11. Biểu đồ tuần tự đăng nhập.
3.3.3.1.4.	Use case tìm kiếm bác sĩ
Mục	Nội dung
Tác nhân	Bệnh nhân
Mô tả	Tra cứu danh sách các bác sĩ nổi bật hoặc tìm kiếm chuyên gia theo nhu cầu
Tiền điều kiện	Không yêu cầu đăng nhập
Hậu điều kiện	Bệnh nhân xem được danh sách và hình ảnh của các bác sĩ
-	Luồng chính:
1. Bệnh nhân truy cập khu vực Danh sách Bác sĩ nổi bật.
2. Hệ thống  tổng hợp hồ sơ của các bác sĩ hiện có trên nền tảng.
3. Hệ thống trích xuất hình ảnh đại diện, họ tên và chức danh chuyên môn.
4. Trình bày danh sách ưu tiên theo thứ tự bác sĩ nổi bật nhất.
 
Hình 3.12. Biểu đồ tuần tự tìm kiếm bác sĩ.

3.3.3.1.5.	Use case xem chi tiết bác sĩ
Mục	Nội dung
Tác nhân	Bệnh nhân
Mô tả	Đọc bài viết giới thiệu chuyên sâu, xem giá khám và thông tin nơi làm việc của bác sĩ
Tiền điều kiện	Không yêu cầu đăng nhập
Hậu điều kiện	Hiển thị đầy đủ giao diện chi tiết hồ sơ y tế của bác sĩ
-	Luồng chính:
1. Bệnh nhân chọn một bác sĩ từ danh sách
2. Hệ thống tổng hợp toàn bộ bài viết chuyên môn giới thiệu về bác sĩ đó.
3. Bổ sung các thông tin phụ trợ: giá tiền khám, loại bảo hiểm hỗ trợ và phương thức thanh toán.
4. Hiển thị trang hồ sơ hoàn chỉnh để bệnh nhân ra quyết định.
 
Hình 3.13. Biểu đồ tuần tự xem chi tiết bác sĩ.
3.3.3.1.6.	Use case xem lịch khám bác sĩ
Mục	Nội dung
Tác nhân	Bệnh nhân
Mô tả	Xem các khung giờ rảnh của bác sĩ để lên kế hoạch đi khám
Tiền điều kiện	Chọn đúng bác sĩ và ngày cần xem
Hậu điều kiện	Liệt kê các khung giờ trống trong ngày
-	Luồng chính: 
1. Tại trang hồ sơ bác sĩ, bệnh nhân chọn một ngày cụ thể trong dropdown.
2. Hệ thống lọc và lấy ra các khung giờ khám mà bác sĩ đã mở cho ngày đó.
3. Loại bỏ các khung giờ đã bị bệnh nhân khác đặt kín chỗ.
4. Hiển thị các ô thời gian còn trống để bệnh nhân lựa chọn.
 
Hình 3.14. Biểu đồ tuần tự xem lịch khám bác sĩ.
3.3.3.1.7.	Use case đặt lịch khám
Mục	Nội dung
Tác nhân	Bệnh nhân
Mô tả	Gửi yêu cầu đặt hẹn giữ chỗ với bác sĩ tại một khung giờ cụ thể
Tiền điều kiện	Bệnh nhân chọn được khung giờ trống
Hậu điều kiện	Hồ sơ lịch hẹn được sinh ra ở trạng thái chờ xử lý (Chưa thanh toán)
-	Luồng chính:
1. Bệnh nhân bấm vào một khung giờ trống.
2. Điền thông tin cá nhân (nếu chưa đăng nhập) hoặc hệ thống tự điền sẵn (nếu đã đăng nhập), bao gồm: tên, giới tính, số điện thoại, ngày sinh và lý do khám bệnh.
3. Hệ thống tạo ra một liên kết xác nhận danh tính bí mật.
4. Xử lý giao dịch an toàn:
+	Hệ thống tạm thời khóa khung giờ đó để tránh người khác đặt trùng.
+	Ghi nhận một số hồ sơ lịch hẹn mới với trạng thái “Chờ thanh toán”
5. Hệ thống gửi thông tin lịch hẹn sang bước Thanh toán và Gửi email xác nhận.
-	Luồng ngoại lệ:
+	Khung giờ vừa bị người khác đặt mất → Cảnh báo: "Rất tiếc khung giờ này đã hết chỗ, vui lòng chọn giờ khác".
 
Hình 3.15. Biểu đồ tuần tự đặt lịch khám.
3.3.3.1.8.	Use case xác nhận lịch khám qua Email
Mục	Nội dung
Tác nhân	Bệnh nhân
Mô tả	Bệnh nhân xác thực danh tính để chốt lịch hẹn, giúp phòng khám tránh các lịch ảo (spam)
Tiền điều kiện	Bệnh nhân đã thanh toán thành công và nhận được email chứa link xác nhận
Hậu điều kiện	Lịch hẹn chuyển sang trạng thái "Đã xác nhận"
-	Luồng chính:
1. Ngay khi đặt lịch, hệ thống gửi một thư điện tử đến địa chỉ email của bệnh nhân.
2. Bệnh nhân mở email và bấm vào đường link xác nhận bảo mật.
3. Hệ thống đối chiếu mã xác minh ẩn trong đường link.
4. Kiểm tra xem lịch hẹn này đã được xác nhận trước đó chưa.
5. Nếu hợp lệ, hệ thống chuyển trạng thái lịch hẹn thành "Đã xác nhận" và ghi nhận lịch hẹn chính thức thành công.
 
Hình 3.16. Biểu đồ tuần tự xác nhận lịch khám qua email.

3.3.3.1.9.	Use case thanh toán chi phí khám
Mục	Nội dung
Tác nhân	Bệnh nhân, Cổng thanh toán (PayOS)
Mô tả	Bệnh nhân tiến hành chuyển khoản thanh toán phí dịch vụ y tế trước khi đến khám
Tiền điều kiện	Bệnh nhân vừa hoàn tất điền form đặt lịch
Hậu điều kiện	Lịch hẹn ghi nhận đã thanh toán thành công
-	Luồng chính:
1. Sau khi điền form đặt lịch, hệ thống tạo ra một hóa đơn điện tử với số tiền tương ứng giá khám của bác sĩ.
2. Bệnh nhân được chuyển hướng sang trang thanh toán bảo mật của cổng PayOS (Quét mã QR).
3. Bệnh nhân thực hiện quét mã bằng ứng dụng ngân hàng.
4. Hệ thống PayOS tự động gửi tín hiệu xác nhận giao dịch (Webhook) về lại hệ thống BookingCare.
5. BookingCare nhận tín hiệu, kiểm tra tính hợp lệ của hóa đơn và đánh dấu lịch hẹn là "Đã thanh toán".
 
Hình 3.17. Biểu đồ tuần tự thanh toán chi phí khám.



3.3.3.1.10.	Use case quản lý lịch sử khám bệnh
Mục	Nội dung
Tác nhân	Bệnh nhân
Mô tả	Xem lại toàn bộ quá trình tương tác y tế của bản thân
-	Luồng chính:
1. Bệnh nhân truy cập mục "Lịch sử khám bệnh" trong tài khoản cá nhân.
2. Hệ thống tổng hợp tất cả các đơn đặt lịch của bệnh nhân đó trong quá khứ và hiện tại.
3. Bệnh nhân có thể xem tóm tắt: Tên bác sĩ, ngày giờ hẹn và trạng thái hiện tại (Đang chờ, Đã khám xong, Đã hủy).
4. Bệnh nhân bấm vào một lịch hẹn để xem chi tiết lý do khám và kết quả y tế (nếu bác sĩ đã gửi trả kết quả).
 
Hình 3.18.  Biểu đồ tuần tự xem danh sách lịch khám.
 
Hình 3.19. Biểu đồ tuần tự xem chi tiết lịch khám.
3.3.3.1.11.	Use case cập nhật thông tin cá nhân
Mục	Nội dung
Tác nhân	Bệnh nhân
Mô tả	Chỉnh sửa hồ sơ liên hệ để phòng khám dễ dàng liên lạc
-	Luồng chính:
1. Bệnh nhân mở trang Hồ sơ cá nhân.
2. Chỉnh sửa họ tên, số điện thoại, địa chỉ hoặc tải lên hình ảnh đại diện mới.
3. Hệ thống đối chiếu dữ liệu và tiến hành lưu đè những thông tin mới cập nhật.
4. Hiển thị thông báo cập nhật hồ sơ thành công.
 
Hình 3.20. Biểu đồ tuần tự cập nhật thông tin.
3.3.3.1.12.	Use case xem chuyên khoa 

Mục	Nội dung
Tác nhân	Bệnh nhân
Mô tả	Giúp người dùng có cái nhìn tổng quan về các dịch vụ y tế và kiến thức chăm sóc sức khỏe.
-	Luồng chính:
1. Bệnh nhân truy cập mục xem chuyên khoa trên giao diện.
2. Hệ thống sẽ truy xuất dữ liệu hình ảnh, tên chuyên khoa và hiển thị dưới dạng lưới trực quan.
3. Khi bệnh nhân bấm vào một mục, hệ thống sẽ mở ra bài viết chi tiết được trình bày bằng văn bảng kèm theo danh sách các bác sĩ liên quan
 
Hình 3.21. Biểu đồ tuần tự xem chuyên khoa.
3.3.3.1.13.	Use case xem phòng khám
Mục 	Nội dung
Tác nhân	Bệnh nhân
Mô tả	Giúp người dùng có cái nhìn tổng quan về các dịch vụ y tế và kiến thức chăm sóc sức khỏe.
-	Luồng chính:
1. Bệnh nhân truy cập mục xem phòng khám trên giao diện.
2. Hệ thống sẽ truy xuất dữ liệu hình ảnh, tên phòng khám và hiển thị dưới dạng lưới trực quan.
3. Khi bệnh nhân bấm vào một mục, hệ thống sẽ mở ra bài viết chi tiết được trình bày bằng văn bảng kèm theo danh sách các bác sĩ liên quan
 
Hình 23: Biểu đồ tuần tự xem phòng khám
3.3.3.1.14.	Use case xem cẩm nang sức khỏe
Mục	Nội dung
Tác nhân	Bệnh nhân
Mô tả	Giúp người dùng có cái nhìn tổng quan về các dịch vụ y tế và kiến thức chăm sóc sức khỏe.
-	Luồng chính:
1. Bệnh nhân truy cập mục xem cẩm nang chuyên khoa trên giao diện.
2. Hệ thống sẽ truy xuất dữ liệu hình ảnh, tên cẩm nang chuyên khoa và hiển thị dưới dạng lưới trực quan.
3. Khi bệnh nhân bấm vào một mục, hệ thống sẽ mở ra bài viết chi tiết được trình bày bằng văn bảng kèm theo danh sách các bác sĩ liên quan
 
Hình 3.23. Biểu đồ tuần tự xem cẩm nang. 
3.3.3.1.15.	Use case tương tác ChatBox AI
Mục	Nội dung
Tác nhân	Bệnh nhân, AI Server
Mô tả	Cho phép bệnh nhân nhập các câu hỏi về triệu chứng bệnh hoặc hỏi cách sử dụng dịch vụ. Hệ thống AI sẽ tự động phân tích ngôn ngữ và đưa ra câu trả lời theo thời gian thực.
Tiền điều kiện	Bệnh nhân truy cập vào trang chủ của hệ thống có tích hợp module ChatBox
Hậu điều kiện	Các cuộc hội thoại được lưu vào cơ sở dữ liệu để bệnh nhân có thể xem lại lịch sử chat
-	Luồng chính:
1. Bệnh nhân bấm vào biểu tượng ChatBox ở góc màn hình.
2. Bệnh nhân nhập câu hỏi và nhân gửi.
3. Giao diện đẩy câu hỏi lên Server kèm theo mã phiên Chat (Session ID)
4. Server chuyển tiếp dữ liệu qua Engine AI (Tích hợp LLM) để xử lý.
5. AI trả về câu trả lời, Server dùng Socke.io đẩy kết quả realtime về giao diện.
6. Màn hình bệnh nhân hiển thị câu trả lời của AI.
-	Luồng ngoại lệ:
	Nếu hệ thống AI bị lỗi phản hồi hoặc mất kết nối mạng, hiển thị thông báo “Trợ lý ảo AI đang bận, vui lòng thử lại sau”.
 
Hình 3.24. Biểu đồ tuần tự tương tác ChatBox AI.
3.3.3.1.16.	Use case Chat trực tiếp với bác sĩ
Mục	Nội dung
Tác nhân	Bác sĩ, Bệnh nhân
Mô tả	Cho phép bệnh nhân và bác sĩ có thể trao đổi tin nhắn văn bản, gửi hình ảnh đơn thuốc theo thời gian thực để hỗi trợ quá trình khám chữa bệnh
Tiền điều kiện	Bệnh nhân và bác sĩ đều phải đăng nhập vào hệ thống
Hậu điều kiện	Các cuộc hội thoại được lưu trữ để có thể tìm kiếm. Hai bênh có thể tương tác mở rộng (Thả cảm xúc, trả lời một tin nhắn cụ thể, xóa đoạn chat)
-	Luồng chính:
1. Người gửi (Bệnh nhân/Bác sĩ) nhập nội dung tin nhắn hoặc đính kèm hình ảnh trên giao diện và nhấn nút gửi.
2. Giao diện chuyển tiếp nội dung tinh nhắn đến hệ thống.
3. Hệ thống yêu cầu Database lưu lại bản ghi tim nhắn mới.
4. Database xác nhận lưu tin nhắn thành công.
5. Hệ thống thông báo lưu thành công về giao diện của người gửi. Giao diện tự động cập nhật tin nhắn vừa gửi lên mành hình.
6. Đồng thời, hệ thống phát sóng (Đẩy) tin nhắn trực tiếp qua cổng kết nối (Socket) đến giao diện của người nhận.
7. Giao diện của người nhận tiếp nhận dữ liệu và lập tức hiển thị tin nhắn mới lên màn hình mà không cần tải lại trang.
8. Hệ thống yêu cầu database cập nhật trạng thái tin nhắn thành “Đã gửi”.
-	Luồng ngoại lệ:
6a. Người nhận đang ngoại tuyến. Hệ thống bỏ qua bước đẩy trực tiếp. Lúc này tin nhắn vẫn được lưu trong database, hệ thống sẽ chờ đến khi người nhận đăng nhập lại để tự động tải lịch sử tin nhắn và hiển thị.
 
Hình 3.25. Biểu đồ tuần tự Chat trực tiếp (Người - Người).
 
3.3.3.2.	Phân rã use case bác sĩ
3.3.3.2.1.	Use case đăng nhập
Mục	Nội dung
Tác nhân	Bác sĩ
Mô tả	Bác sĩ đăng nhập hệ thống để quản lý lịch khám và bệnh nhân
Tiền điều kiện	Bác sĩ đã được tạo tài khoản hợp lệ với phân quyền Bác sĩ
Hậu điều kiện	Bác sĩ đăng nhập thành công và được chuyển hướng đến trang quản lý dành riêng cho bác sĩ
-	Luồng chính:
1. Bác sĩ truy cập màn hình đăng nhập và nhập email, mật khẩu.
2. Hệ thống xác thực email và kiểm tra tính hợp lệ của mật khẩu thông qua cơ chế bảo mật.
3. Hệ thống tạo phiên làm việc an toàn để duy trì trạng thái đăng nhập.
4. Hệ thống ghi nhận trạng thái đăng nhập thành công.
5. Chuyển hướng bác sĩ vào trang giao diện Hệ thống Quản lý Bác sĩ.
-	Luồng ngoại lệ:
2a. Email không tồn tại → Hệ thống báo lỗi: "Tài khoản không tồn tại".
2b. Sai mật khẩu → Hệ thống báo lỗi: "Mật khẩu không chính xác".
 
Hình 3.26. Biểu đồ tuần tự đăng nhập của bác sĩ
3.3.3.2.2.	Use case cập nhật thông tin cá nhân
Mục	Nội dung
Tác nhân	Bác sĩ
Mô tả	Cập nhật hồ sơ bác sĩ: bài viết giới thiệu, giá khám, phương thức thanh toán, bảo hiểm, chuyên khoa, phòng khám
Tiền điều kiện	Bác sĩ đã đăng nhập thành công
Hậu điều kiện	Hồ sơ thông tin khám bệnh của bác sĩ được lưu trữ và cập nhật đồng bộ trên hệ thống
-	Luồng chính:
1. Bác sĩ truy cập trang Quản lý thông tin.
2. Bác sĩ nhập hoặc chỉnh sửa các thông tin: Bài viết giới thiệu chuyên môn, giá khám, phương thức thanh toán, bảo hiểm hỗ trợ, chuyên khoa và phòng khám trực thuộc.
3. Hệ thống kiểm tra tính đầy đủ của các trường thông tin bắt buộc.
4. Hệ thống cập nhật nội dung bài viết giới thiệu của bác sĩ.
5. Hệ thống cập nhật các thiết lập y tế (giá khám, phòng khám, số lượng bệnh nhân tối đa).
6. Hệ thống tự động xóa bỏ các liên kết chuyên khoa/phòng khám cũ và thiết lập liên kết mới để đảm bảo tính đồng bộ của dữ liệu.
7. Trả về thông báo lưu thông tin thành công.
-	Luồng ngoại lệ:
3a. Bỏ trống các mục quan trọng → Hệ thống yêu cầu điền đầy đủ các thông tin bắt buộc.
 
Hình 3.27. Biểu đồ tuần tự cập nhật thông tin cá nhân của bác sĩ.
3.3.3.2.3.	Use case thiết lập lịch làm việc 
Mục	Nội dung
Tác nhân	Bác sĩ
Mô tả	Bác sĩ chủ động tạo hàng loạt khung giờ trống để tiếp nhận bệnh nhân cho các ngày làm việc
Tiền điều kiện	Bác sĩ đã đăng nhập và đã hoàn thiện hồ sơ thông tin khám bệnh
Hậu điều kiện	Lịch làm việc mới của bác sĩ được hệ thống ghi nhận
-	Luồng chính: 
1. Bác sĩ chọn ngày làm việc, chọn phòng khám cụ thể và đánh dấu các khung giờ trống muốn tiếp nhận bệnh nhân.
2. Hệ thống tiếp nhận yêu cầu thiết lập lịch.
3. Hệ thống áp dụng giới hạn số lượng bệnh nhân tối đa cho mỗi khung giờ dựa trên hồ sơ của bác sĩ.
4. Hệ thống đối chiếu với lịch làm việc hiện tại của bác sĩ trong ngày đó.
5. Hệ thống tự động gỡ bỏ các khung giờ không còn được chọn (với điều kiện chưa có bệnh nhân nào đặt khám).
6. Kiểm tra xung đột: Nếu bác sĩ đổi phòng khám trong ngày nhưng đã có lịch hẹn ở phòng khám cũ → Hệ thống chặn thao tác bảo vệ dữ liệu.
7. Cập nhật phòng khám đồng nhất cho toàn bộ các khung giờ trong ngày làm việc đó.
8. Lưu mới và cập nhật toàn bộ cấu hình lịch làm việc.
9. Trả về thông báo thiết lập thành công.
-	Luồng ngoại lệ:
2a. Chưa chọn ngày hoặc khung giờ → Hệ thống báo lỗi yêu cầu chọn đủ thông tin.
6a. Xung đột phòng khám → Hệ thống cảnh báo: "Không thể đổi phòng khám vì đã có bệnh nhân đặt lịch trước đó".
 
Hình 3.28. Biểu đồ tuần tự thiết lập lịch làm việc.
3.3.3.2.4.	Use case quản lý lịch khám
Mục	Nội dung
Tác nhân	Bác sĩ
Mô tả	Theo dõi và kiểm tra các khung giờ đã mở rảnh rỗi theo ngày
Tiền điều kiện	Bác sĩ đã đăng nhập
Hậu điều kiện	Hiển thị danh sách các khung giờ khám đã đăng ký
-	Luồng chính:
1. Bác sĩ chọn một ngày cụ thể cần xem lịch.
2. Hệ thống định dạng và đồng bộ hóa mốc thời gian.
3. Truy xuất toàn bộ danh sách các khung giờ trống và thông tin phòng khám tương ứng của bác sĩ đó.
4. Hiển thị danh sách các khung giờ khám lên màn hình giao diện.
 
Hình 3.29. Biểu đồ tuần tự quản lý lịch khám.
3.3.3.2.5.	Use case xem danh sách bệnh nhân
Mục	Nội dung
Tác nhân	Bác sĩ
Mô tả	Xem danh sách bệnh nhân đã đặt lịch trong ngày, hệ thống tự động dọn dẹp các lịch hẹn hết hạn
Tiền điều kiện	Bác sĩ đã đăng nhập
Hậu điều kiện	Hiển thị danh sách bệnh nhân đã được làm sạch lịch ảo, sắp xếp khoa học theo thứ tự ưu tiên
-	Luồng chính: 
1. Bác sĩ chọn ngày làm việc cần theo dõi danh sách bệnh nhân.
2. Tiến trình tự động dọn dẹp (Auto Cleanup):
+	Các lịch hẹn đang chờ thanh toán nhưng quá thời gian quy định (15 phút) sẽ tự động bị hệ thống Hủy bỏ.
+	Các lịch hẹn đã được xác nhận nhưng quá ngày hẹn mà chưa khám sẽ bị chuyển sang trạng thái Quá hạn.
3. Hệ thống truy xuất danh sách toàn bộ các lịch hẹn hợp lệ của bác sĩ trong ngày đó.
4. Tổng hợp thông tin liên hệ và y tế của bệnh nhân (Họ tên, tuổi, giới tính, số điện thoại, lý do đến khám).
5. Phân loại và sắp xếp mức độ ưu tiên: Đã xác nhận > Đã khám xong > Quá hạn > Đang chờ > Đã hủy.
6. Trả về danh sách hiển thị chi tiết cho bác sĩ.
-	Luồng ngoại lệ:
1a. Chưa chọn ngày → Hệ thống yêu cầu chọn ngày cụ thể.
 
Hình 3.30. Biểu đồ tuần tự xem danh sách bệnh nhân.
3.3.3.2.6.	Use case xác nhận lịch hẹn
Mục	Nội dung
Tác nhân	Bác sĩ
Mô tả	Bác sĩ ghi nhận một lịch hẹn đã sẵn sàng để tiến hành khám chữa bệnh
Tiền điều kiện	Lịch hẹn đang ở trạng thái đã thanh toán và chờ xác nhận
Hậu điều kiện	Trạng thái lịch hẹn được cập nhật chính thức trên hệ thống
-	Luồng chính:
1. Bác sĩ xem danh sách bệnh nhân và chọn một lịch hẹn cần xử lý.
2. Bác sĩ nhấn nút "Xác nhận".
3. Hệ thống đối chiếu và tìm kiếm thông tin chi tiết của cuộc hẹn.
4. Cập nhật trạng thái lịch hẹn tương ứng để chuyển sang bước tiếp theo.
5. Thông báo thao tác ghi nhận thành công.
-	Luồng ngoại lệ:
3a. Không tìm thấy cuộc hẹn trong hệ thống → Hệ thống báo lỗi: "Không tìm thấy thông tin lịch hẹn".
 
Hình 3.31. Biểu đồ tuần tự xác nhận lịch hẹn.
3.3.3.2.7.	Use case hòa tất khám bệnh 
Mục	Nội dung
Tác nhân	Bác sĩ
Mô tả	Bác sĩ đánh dấu quá trình khám đã xong, hệ thống tự động trả kết quả cho bệnh nhân qua email
Tiền điều kiện	Bệnh nhân đang ở trạng thái chuẩn bị hoặc đang khám
Hậu điều kiện	Lịch hẹn chuyển sang trạng thái "Đã hoàn thành", hệ thống kích hoạt tiến trình gửi thư điện tử
-	Luồng chính:
1. Sau khi khám xong, bác sĩ chọn lịch hẹn của bệnh nhân đó và nhấn nút "Hoàn thành".
2. Hệ thống ghi nhận trạng thái lịch hẹn là "Đã khám xong".
3. Hệ thống kiểm tra xem hồ sơ bệnh nhân có địa chỉ email hợp lệ để nhận kết quả hay không.
4. Hệ thống tự động kích hoạt dịch vụ gửi Thư điện tử (Email) đính kèm kết quả chẩn đoán, lời dặn dò và cảm ơn.
5. Thông báo quy trình khám bệnh hoàn tất thành công cho bác sĩ.
-	Luồng ngoại lệ:
4a. Sự cố kết nối mạng khiến gửi email thất bại → Hệ thống ghi nhận lỗi ngầm nhưng vẫn xác nhận hoàn tất ca khám bệnh trên màn hình của bác sĩ.
 
Hình 3.32. Biểu đồ tuần tự hoàn tất lịch khám.
3.3.3.2.8.	Use case gửi email kết quả khám
Mục	Nội dung
Tác nhân	Hệ thống Email tự động
Mô tả	Tự động tạo và gửi thư điện tử thông báo hoàn tất quá trình khám bệnh đến tay bệnh nhân
Tiền điều kiện	Lịch hẹn đã được bác sĩ đánh dấu "Đã hoàn thành"
Hậu điều kiện	Bệnh nhân nhận được thư cảm ơn và kết quả y khoa
-	Luồng chính: 
1. Hệ thống thiết lập kết nối bảo mật với máy chủ gửi thư điện tử.
2. Hệ thống tự động biên soạn nội dung thư (hỗ trợ đa ngôn ngữ Tiếng Việt/Tiếng Anh):
	Tiêu đề thư: "Kết quả khám bệnh & Cảm ơn".
	Nội dung thư: Tên bệnh nhân, tên bác sĩ trực tiếp khám, thời gian thực hiện và địa chỉ phòng khám.
	Ghi nhận trạng thái: Quá trình khám đã hoàn thành tốt đẹp.
3. Hệ thống tiến hành gửi thư điện tử đến hòm thư cá nhân của bệnh nhân.
 
Hình 3.33. Biểu đồ tuần tự gửi email kết quả khám.
3.3.3.3.	Phân ra use case quản trị viên
3.3.3.3.1.	Use case đăng nhập 
Mục	Nội dung
Tác nhân	Quản trị viên 
Mô tả	Quản trị viên đăng nhập hệ thống để quản lý toàn bộ dữ liệu
Tiền điều kiện	Quản trị viên đã được cấp tài khoản với quyền hạn cao nhất
Hậu điều kiện	Đăng nhập thành công và được chuyển hướng đến bảng điều khiển dành riêng cho Quản trị viên
-	Luồng chính: 
1. Quản trị viên nhập email và mật khẩu tại màn hình đăng nhập.
2. Hệ thống xác thực tính hợp lệ của tài khoản.
3. Khi phát hiện tài khoản có quyền Quản trị viên, hệ thống sẽ cấp quyền truy cập toàn diện (không giới hạn tính năng).
4. Hệ thống chuyển hướng Quản trị viên vào Trang Quản lý (Admin Dashboard).
 
Hình 3.34. Biểu đồ tuần tự đăng nhập của quản trị viên.
3.3.3.3.2.	Use case quản lý tài khoản người dùng
Mục	Nội dung
Tác nhân	Quản trị viên 
Mô tả	Cung cấp công cụ để Admin thêm mới, cập nhật, xóa và xem danh sách toàn bộ người dùng trong hệ thống (bao gồm Bác sĩ, Bệnh nhân và các Admin khác)
Tiền điều kiện	Quản trị viên đã đăng nhập
Hậu điều kiện	Dữ liệu người dùng được cập nhật tương ứng vào cơ sở dữ liệu
Xem danh sách người dùng
-	Luồng chính:
1. Quản trị viên truy cập trang Quản lý người dùng.
2. Hệ thống truy xuất danh sách toàn bộ người dùng (loại trừ các thông tin bảo mật như mật khẩu).
3. Hệ thống hiển thị bảng danh sách người dùng trên màn hình.
 
Hình 3.35. Biểu đồ tuần tự xem danh sách người dùng.
Thêm người dùng mới
-	Luồng chính:
1. Quản trị viên bấm nút "Thêm người dùng mới".
2. Điền các thông tin: Email, mật khẩu, họ tên, địa chỉ, số điện thoại, giới tính, ảnh đại diện, vai trò (Role) và chức danh.
3. Hệ thống kiểm tra xem email đã được sử dụng hay chưa.
4. Hệ thống áp dụng cơ chế bảo mật để mã hóa mật khẩu.
5. Khởi tạo hồ sơ người dùng mới trong hệ thống.
6. Trả về thông báo thành công.
-	Luồng ngoại lệ:
3a. Email đã tồn tại → Hệ thống báo lỗi: "Email đã được sử dụng".
 
Hình 3.36. Biểu đồ tuần tự thêm người dùng mới.
Sửa thông tin người dùng
-	Luồng chính:
1. Quản trị viên chọn một người dùng cần sửa từ danh sách.
2. Chỉnh sửa các thông tin cá nhân hoặc quyền hạn.
3. Hệ thống kiểm tra tính hợp lệ của các thông tin bắt buộc.
4. Hệ thống cập nhật các thay đổi vào hồ sơ người dùng tương ứng.
5. Thông báo cập nhật thành công.
-	Luồng ngoại lệ:
3a. Bỏ trống các trường bắt buộc → Báo lỗi yêu cầu nhập đủ.
4a. Không tìm thấy tài khoản → Báo lỗi: "Người dùng không tồn tại".
 
Hình 3.37. Biểu đồ tuần tự sửa thông tin người dùng.
Xóa người dùng
-	Luồng chính:
1. Quản trị viên bấm nút "Xóa" tương ứng với người dùng cần xóa.
2. Hệ thống kiểm tra xác nhận tồn tại của người dùng.
3. Tiến hành xóa dữ liệu người dùng khỏi hệ thống
4. Trả về thông báo xóa thành công
-	Luồng ngoại lệ:
2a. Người dùng không tồn tại → Báo lỗi: "Không tìm thấy người dùng".
 
Hình 3.38. Biểu đồ tuần tự xóa người dùng.
3.3.3.3.3.	Use case phân quyền người dùng
Mục	Nội dung
Tác nhân	Quản trị viên 
Mô tả	Quản trị viên thay đổi vai trò (Role) của người dùng để quyết định mức độ truy cập chức năng của họ
Tiền điều kiện	Quản trị viên đã đăng nhập
Hậu điều kiện	Phân quyền của người dùng được thay đổi, ảnh hưởng trực tiếp đến quyền truy cập chức năng
-	Luồng chính:
1. Quản trị viên chọn một người dùng từ danh sách và mở khung chỉnh sửa.
2. Chọn vai trò mới: Quản trị viên, Bác sĩ, hoặc Bệnh nhân.
3. Hệ thống ghi nhận và thay đổi quyền của người dùng.
4. Kể từ lần thao tác tiếp theo, hệ thống bảo mật sẽ tự động áp dụng bộ quyền mới cho tài khoản này.
 
Hình 3.39. Biểu đồ tuần tự phân quyền người dùng.
3.3.3.3.4.	Use case quản lý thông tin bác sĩ
Mục	Nội dung
Tác nhân	Quản trị viên 
Mô tả	Quản trị viên thay mặt bác sĩ hoặc chủ động cập nhật hồ sơ y tế: bài viết giới thiệu, giá khám, chuyên khoa và phòng khám trực thuộc
Tiền điều kiện	Quản trị viên đã đăng nhập, tài khoản bác sĩ đã được tạo
Hậu điều kiện	Hồ sơ thông tin khám bệnh của bác sĩ được cập nhật
-	Luồng chính: 
1. Quản trị viên truy cập trang Quản lý thông tin bác sĩ.
2. Quản chị viên chọn một bác sĩ
3. Quản trị viên nhập hoặc chỉnh sửa các thông tin: Bài viết giới thiệu chuyên môn, giá khám, phương thức thanh toán, bảo hiểm hỗ trợ, chuyên khoa và phòng khám trực thuộc.
4. Hệ thống kiểm tra tính đầy đủ của các trường thông tin bắt buộc.
5. Hệ thống cập nhật nội dung bài viết giới thiệu của bác sĩ.
6. Hệ thống cập nhật các thiết lập y tế (giá khám, phòng khám, số lượng bệnh nhân tối đa).
7. Hệ thống tự động xóa bỏ các liên kết chuyên khoa/phòng khám cũ và thiết lập liên kết mới để đảm bảo tính đồng bộ của dữ liệu.
8. Trả về thông báo lưu thông tin thành công.
-	Luồng ngoại lệ:
4a. Bỏ trống các mục quan trọng → Hệ thống yêu cầu điền đầy đủ các thông tin bắt buộc.
 
Hình 3.40. Biểu đồ tuần tự quản lý thông tin bác sĩ.
3.3.3.3.5.	Use case quản lý chuyên khoa 
Mục	Nội dung
Tác nhân	Quản trị viên 
Mô tả	Thêm, sửa, xóa thông tin danh mục các chuyên khoa y tế
Tiền điều kiện	Quản trị viên đã đăng nhập
Hậu điều kiện	Dữ liệu chuyên khoa được cập nhật để hiển thị cho Bệnh nhân
 
Thêm chuyên khoa
-	Luồng chính:
1 Quản trị viên nhập tên chuyên khoa, tải hình ảnh đại diện và viết bài mô tả chi tiết.
2. Hệ thống kiểm tra xem các thông tin bắt buộc đã được điền đủ chưa.
3. Khởi tạo và lưu mới chuyên khoa vào hệ thống.
Sửa chuyên khoa
-	Luồng chính:
1. Quản trị viên chọn một chuyên khoa hiện có, tiến hành chỉnh sửa tên, bài viết hoặc cập nhật ảnh mới.
2. Hệ thống đối chiếu và ghi đè thông tin mới lên dữ liệu cũ.
3. Lưu lại thay đổi.
Xóa chuyên khoa
-	Luồng chính:
1. Quản trị viên bấm xóa chuyên khoa.
2. Hệ thống tiến hành xóa dữ liệu liên quan khỏi cơ sở dữ liệu nền.
 
Hình 3.41. Biểu đồ tuần tự quản lý chuyên khoa.
3.3.3.3.6.	Use case quản lý phòng khám 
Mục	Nội dung
Tác nhân	Quản trị viên 
Mô tả	Thêm, sửa, xóa thông tin các cơ sở y tế / phòng khám hợp tác
Tiền điều kiện	Quản trị viên đã đăng nhập
Hậu điều kiện	Danh sách phòng khám được cập nhật trên nền tảng
Thêm phòng khám
-	Luồng chính:
1 Quản trị viên nhập tên phòng khám, tải hình ảnh đại diện và viết bài mô tả chi tiết.
2. Hệ thống kiểm tra xem các thông tin bắt buộc đã được điền đủ chưa.
3. Khởi tạo và lưu mới phòng khám vào hệ thống.
Sửa phòng khám
-	Luồng chính:
1. Quản trị viên chọn một phòng khám hiện có, tiến hành chỉnh sửa tên, bài viết hoặc cập nhật ảnh mới.
2. Hệ thống đối chiếu và ghi đè thông tin mới lên dữ liệu cũ.
3. Lưu lại thay đổi.
Xóa phòng khám
-	Luồng chính:
1. Quản trị viên bấm xóa phòng khám.
2. Hệ thống tiến hành xóa dữ liệu liên quan khỏi cơ sở dữ liệu nền.
 
Hình 3.42. Biểu đồ tuần tự quản lý phòng khám.
3.3.3.3.7.	Use case quản lý cẩm nang
Mục	Nội dung
Tác nhân	Quản trị viên 
Mô tả	Xây dựng và biên tập các bài viết chia sẻ kiến thức y tế, chăm sóc sức khỏe
Tiền điều kiện	Quản trị viên đã đăng nhập
Hậu điều kiện	Bài viết được xuất bản lên hệ thống
Thêm cẩm nang
-	Luồng chính:
1 Quản trị viên nhập tên cẩm nang, tải hình ảnh đại diện và viết bài mô tả chi tiết.
2. Hệ thống kiểm tra xem các thông tin bắt buộc đã được điền đủ chưa.
3. Khởi tạo và lưu mới phòng khám vào hệ thống.
Sửa cẩm nang
-	Luồng chính:
1. Quản trị viên chọn một cẩm nang hiện có, tiến hành chỉnh sửa tên, bài viết hoặc cập nhật ảnh mới.
2. Hệ thống đối chiếu và ghi đè thông tin mới lên dữ liệu cũ.
3. Lưu lại thay đổi.
Xóa cẩm nang
-	Luồng chính:
1. Quản trị viên bấm xóa cẩm nang.
2. Hệ thống tiến hành xóa dữ liệu liên quan khỏi cơ sở dữ liệu nền.
 
Hình 3.43. Biểu đồ tuần tự quản lý cẩm nang.
3.3.3.3.8.	Use case quản lý lịch khám bác sĩ 
Mục	Nội dung
Tác nhân	Quản trị viên 
Mô tả	Quản trị viên hỗ trợ bộ phận điều phối để tạo lịch khám sẵn sàng cho bác sĩ
Tiền điều kiện	Quản trị viên đã đăng nhập
Hậu điều kiện	Lịch làm việc mới của bác sĩ được đưa lên hệ thống để bệnh nhân đặt lịch
-	Luồng chính: 
1. Quản trị viên chọn tên bác sĩ cụ thể
2. Quản trị viên chọn ngày làm việc, chọn phòng khám cụ thể và đánh dấu các khung giờ trống muốn tiếp nhận bệnh nhân.
3. Hệ thống tiếp nhận yêu cầu thiết lập lịch.
4. Hệ thống áp dụng giới hạn số lượng bệnh nhân tối đa cho mỗi khung giờ dựa trên hồ sơ của bác sĩ.
5. Hệ thống đối chiếu với lịch làm việc hiện tại của bác sĩ trong ngày đó.
6. Hệ thống tự động gỡ bỏ các khung giờ không còn được chọn (với điều kiện chưa có bệnh nhân nào đặt khám).
7. Kiểm tra xung đột: Nếu bác sĩ đổi phòng khám trong ngày nhưng đã có lịch hẹn ở phòng khám cũ → Hệ thống chặn thao tác bảo vệ dữ liệu.
8. Cập nhật phòng khám đồng nhất cho toàn bộ các khung giờ trong ngày làm việc đó.
9. Lưu mới và cập nhật toàn bộ cấu hình lịch làm việc.
10. Trả về thông báo thiết lập thành công.
-	Luồng ngoại lệ:
3a. Chưa chọn ngày hoặc khung giờ → Hệ thống báo lỗi yêu cầu chọn đủ thông tin.
7a. Xung đột phòng khám → Hệ thống cảnh báo: "Không thể đổi phòng khám vì đã có bệnh nhân đặt lịch trước đó".
 
Hình 3.44. Biểu đồ tuần tự quản lý lịch khám bác sĩ.
3.3.3.3.9.	Use case cập nhật thông tin bệnh nhân
Mục	Nội dung
Tác nhân	Quản trị viên 
Mô tả	Quản trị viên hỗ trợ chỉnh sửa thông tin cá nhân của người bệnh trong trường hợp họ cần trợ giúp (sai số điện thoại, đổi tên)
Tiền điều kiện	Quản trị viên đã đăng nhập
Hậu điều kiện	Hồ sơ của bệnh nhân được cập nhật chuẩn xác
-	Luồng chính:
1. Quản trị viên tìm kiếm và chọn hồ sơ bệnh nhân cần chỉnh sửa.
2. Cập nhật các thông tin liên hệ như họ tên, số điện thoại, địa chỉ, giới tính.
3. Hệ thống đối chiếu sự tồn tại của hồ sơ bệnh nhân đó.
4. Ghi nhận thay đổi để đảm bảo bệnh nhân nhận được thông tin liên lạc chính xác.
5. Thông báo thao tác thành công.
 
Hình 3.45. Biểu đồ tuần tự cập nhật thông tin bệnh nhân 
3.3.3.4.	Sơ đồ use case của bệnh nhân
 
Hình 3.46. Use case bệnh nhân
 
3.3.3.5.	Use case của bác sĩ
 
Hình 3.47. Use case bác sĩ.

3.3.3.6.	Use case của quản trị viên
 
Hình 3.48. Use case quản trị viên.

3.4.	Thiết kế cơ sở dữ liệu
3.4.1.	Các loại dữ liệu mà hệ thống phần mềm sẽ tác nghiệp
-	Dữ liệu có cấu trúc: đây là loại dữ liệu có thể mô hình hóa các đối tượng thông tin và được lưu trữ trong cơ sở dữ liệu quan hệ (MySQL). Bao gồm:
	Thông tin người dùng (Users)
	Thông tin bác sĩ (Doctors)
	Thông tin chuyên khoa (Specialties)
	Thông tin bệnh nhân (Patients)
	Thông tin cơ sở khám (Clinics)
	Lịch khám (Schedules)
	Đặt lịch khám (Bookings)
	Thanh toán (Payments)
-	Dữ liệu phi cấu trúc: loại dữ liệu này không có cấu trúc rõ ràng và không thể chứa được trong cơ sở dữ liệu hàng và cột và nó không có mô hình dữ liệu liên quan. Dữ liệu phi cấu trúc thường được lưu trữ trong kho dữ liệu, cơ sở dữ liệu NoSQL, ứng dụng và các kho dữ liệu khác thay vì sử dụng Excel hoặc cơ sở dữ liệu quan hệ.
	Hình ảnh bác sĩ, phòng khám
	Nội dung bài viết 
	Nội dung mô tả 
-	Dữ liệu bán cấu trúc: bên cạnh dữ liệu có cấu trúc và phi cấu trúc, còn có một loại dữ liệu khác về cơ bản dựa trên sự kết hợp của cả hai. Kiểu dữ liệu này có một số thuộc tính đồng nhất dễ nhận biết, nhưng không tạo thành cấu trúc rõ ràng và nhất quán của cơ sở dữ liệu quan hệ. Vì vậy, để tạo điều kiện thuận lợi cho việc sắp xếp, nó được gắn cho một số thuộc tính tổ chức, chẳng hạn như thẻ ngữ nghĩa hoặc siêu dữ liệu, nhưng vẫn sẽ có những khoảng trống trong quá trình phân loại. Email là một ví dụ điển hình. Nội dung thực tế của một email không có cấu trúc, nhưng nó mang dữ liệu có cấu trúc như tên người gửi và người nhận, địa chỉ, thời gian gửi,…. 
	Email xác nhận đặt lịch
	Thông báo thanh toán
3.4.2.	Hệ cơ sở dữ liệu được thiết kế để triển khai hệ thống 
3.4.2.1.	Tổng quan hệ thống.
Hệ thống đặt lịch khám bệnh được xây dựng dựa trên hệ quản trị cơ sở dữ liệu MySQL và mô hình kiến trúc Client – Server kết hợp 3 – Tier. Hệ thống được thiết kế nhằm đảm bảo khả năng mở rộng cao, dễ bảo trì và phân tách rõ ràng giữa giao diện, xử lý và dữ liệu.
3.4.2.2.	Kiến trúc hệ thống
1.	Tầng trình diễn
Chức năng:
-	Hiển thị giao diện người dùng
-	Nhận input từ người dùng (đăng nhập, đăng ký, đặt lịch khám, …)
-	Gửi request đến server thông qua API
-	Nhận dữ liệu từ server và hiển thị
2.	Tầng xử lý nghiệp vụ
Chức năng:
-	Xử lý logic nghiệp vụ:
	Đăng nhập / đăng ký
	Đặt lịch khám
	Xử lý thanh toán
-	Kiểm tra dữ liệu đầu vào 
-	Phân quyền người dùng (admin / doctor / patient)
-	Giao tiếp với database thông ORM
3.	Tầng dữ liệu
Chức năng:
-	Lưu trữ toàn bộ dữ liệu hệ thống
-	Quản lý quan hệ giữa các bảng 
-	Đảm bảo tính toàn vẹn dữ liệu
Dữ liệu lưu trữ bao gồm:
-	Người dùng
-	Bác sĩ 
-	Bệnh nhân
-	Lịch khám
-	Phòng khám 
-	Chuyên khoa
-	Đặt lịch 
-	Thanh toán
3.4.3.	Cấu trúc các bảng cơ sở dữ liệu của hệ thống quản lý đặt lịch khám
Theo yêu cầu đề ra phần thiết kế cơ sở dữ liệu chúng em chỉ làm từ phần thiết kế logic đến phần thiết kế mức vật lý. Không cần thiết kế mức thực thể liên kết – ERM.
Users: Lưu trữ thông tin tài khoản của tất cả các đối tượng tham gia hệ thống (Admin, Bác sĩ, Bệnh nhân).
Tên thuộc tính	Kiểu dữ liệu	Mô tả
id	Số nguyên	Mã định danh người dùng (Khóa chính - Tự động tăng)
email	Chuỗi ký tự	Địa chỉ email đăng nhập, là duy nhất (Unique)
password	Chuỗi ký tự	Mật khẩu đã được mã hóa bảo mật (Bcrypt)
firstName	Chuỗi ký tự	Tên người dùng
lastName	Chuỗi ký tự	Họ và tên đệm
address	Chuỗi ký tự	Địa chỉ liên hệ hiện tại
phonenumber	Chuỗi ký tự	Số điện thoại liên lạc
gender	Chuỗi ký tự	Giới tính (FK liên kết với Allcodes: M, F, O)
image	Văn bản dài	Lưu trữ hình ảnh đại diện (mã hóa Base64)
roleId	Chuỗi ký tự	Quyền hạn tài khoản (FK liên kết Allcodes: R1, R2, R3)
positionId	Chuỗi ký tự	Chức danh chuyên môn (FK liên kết Allcodes: P0 đến P4)
createdAt	Ngày giờ	Thời điểm khởi tạo tài khoản
updatedAt	Ngày giờ	Thời điểm cập nhật tài khoản gần nhất
allCodes: Lưu trữ các hằng số, trạng thái và danh mục dùng chung (Master Data) để tránh hard-code.
Tên thuộc tính	Kiểu dữ liệu	Mô tả
id	Số nguyên	Mã định danh hằng số (Khóa chính - Tự động tăng)
type	Chuỗi ký tự	Phân loại danh mục (VD: ROLE, STATUS, TIME, GENDER)
keyMap	Chuỗi ký tự	Mã khóa dùng để liên kết (VD: R1, S1, T1). Là duy nhất
valueEn	Chuỗi ký tự	Giá trị hiển thị bằng Tiếng Anh (VD: Admin, New)
valueVi	Chuỗi ký tự	Giá trị hiển thị bằng Tiếng Việt (VD: Quản trị viên, Mới)
createdAt	Ngày giờ	Thời điểm khởi tạo bản ghi
updatedAt	Ngày giờ	Thời điểm cập nhật bản ghi
Doctor_infor: Lưu trữ các thiết lập chuyên môn, tài chính và địa điểm khám của bác sĩ.
Tên thuộc tính	Kiểu dữ liệu	Mô tả
id	Số nguyên	Mã định danh hồ sơ y tế (Khóa chính - Tự động tăng)
doctorId	Số nguyên	Khóa ngoại (FK) liên kết tới bảng Specialties
specialtyId	Số nguyên	Mã định danh chuyên khoa
clinicId	Số nguyên	Khóa ngoại (FK) liên kết tới bảng Clinics
priceId	Chuỗi ký tự	Mức giá khám bệnh (FK liên kết Allcodes, VD: PRI1)
provinceId	Chuỗi ký tự	Tỉnh thành nơi làm việc (FK liên kết All-codes, VD: PRO1)
paymentId	Chuỗi ký tự	Hình thức thanh toán chấp nhận (FK All-codes, VD: PAY1)
addressClinic	Chuỗi ký tự	Địa chỉ chi tiết phòng khám của bác sĩ
nameClinic	Chuỗi ký tự	Tên riêng của phòng khám nơi bác sĩ làm việc
note	Chuỗi ký tự	Ghi chú thêm cho bệnh nhân (VD: Khám ngoài giờ)
count	Số nguyên	Số lượng bệnh nhân tối đa bác sĩ có thể nhận trong 1 khung giờ
createdAt	Ngày giờ	Thời điểm khởi tạo thiết lập
updatedAt	Ngày giờ	Thời điểm cập nhật thiết lập
Specialties: Lưu trữ danh mục các chuyên khoa khám chữa bệnh.
Tên thuộc tính	Kiểu dữ liệu	Mô tả
id	Số nguyên	Mã định danh chuyên khoa (Khóa chính - Tự động tăng)
name	Chuỗi ký tự	Tên chuyên khoa (Cơ xương khớp, Thần kinh)
descriptionHTML	Văn bản dài	Bài viết mô tả các bệnh lý thuộc chuyên khoa (HTML)
descriptionMarkdown	Văn bản dài	Bài viết mô tả chuyên khoa dạng Markdown
image	Chuỗi ký tự	Hình ảnh biểu tượng của chuyên khoa
createdAt	Ngày giờ	Thời điểm khởi tạo
updatedAt	Ngày giờ	Thời điểm cập nhật
Clinics: Lưu trữ thông tin các bệnh viện, phòng khám đang hợp tác trên nền tảng.
Tên thuộc tính	Kiểu dữ liệu	Mô tả
id	Số nguyên	Mã định danh phòng khám (Khóa chính - Tự động tăng)
name	Chuỗi ký tự	Tên chính thức của phòng khám / cơ sở y tế
address	Chuỗi ký tự	Địa chỉ thực tế của phòng khám
descriptionHTML	Văn bản dài	Bài viết giới thiệu phòng khám được định dạng HTML
descriptionMarkdown	Văn bản dài	Bài viết giới thiệu phòng khám dạng Markdown (để chỉnh sửa)
image	Chuỗi ký tự	Logo / Hình ảnh đại diện của phòng khám
createdAt	Ngày giờ	Thời điểm khởi tạo
updatedAt	Ngày giờ	Thời điểm cập nhật
Handbooks: Lưu trữ các bài viết blog, chia sẻ kiến thức y tế.
Tên thuộc tính	Kiểu dữ liệu	Mô tả
id	Số nguyên	Mã định danh bài viết (Khóa chính - Tự động tăng)
name	Chuỗi ký tự	Tiêu đề của bài viết cẩm nang
descriptionHTML	Văn bản dài	Nội dung chi tiết của bài viết (HTML)
descriptionMarkdown	Văn bản dài	Nội dung bài viết định dạng Mark-down
image	Chuỗi ký tự	Hình thu nhỏ (Thumbnail) của bài viết
createdAt	Ngày giờ	Thời điểm đăng bài
updatedAt	Ngày giờ	Thời điểm chỉnh sửa bài
Markdowns: Bảng phụ trợ lưu trữ bài viết giới thiệu chuyên sâu cho Bác sĩ.
Tên thuộc tính	Kiểu dữ liệu	Mô tả
id	Số nguyên	Mã định danh nội dung (Khóa chính - Tự động tăng)
contentHTML	Văn bản dài	Bài viết giới thiệu chuyên sâu định dạng HTML hiển thị ra Web
contentMarkdown	Văn bản dài	Mã nguồn bài viết dạng Markdown dùng để chỉnh sửa
description	Văn bản dài	Đoạn văn bản mô tả ngắn (Tóm tắt sơ yếu lý lịch)
doctorId	Số nguyên	Khóa ngoại (FK) liên kết tới bác sĩ (bảng Users)
specialtyId	Số nguyên	Khóa ngoại (FK) liên kết chuyên khoa (Tùy chọn)
clinicId	Số nguyên	Khóa ngoại (FK) liên kết phòng khám (Tùy chọn)
createdAt	Ngày giờ	Thời điểm khởi tạo bài viết
updatedAt	Ngày giờ	Thời điểm chỉnh sửa bài viết
Schedules: Lưu trữ các khung giờ trống đã được thiết lập bởi bác sĩ.
Tên thuộc tính	Kiểu dữ liệu	Mô tả
id	Số nguyên	Mã định danh lịch làm việc (Khóa chính - Tự động tăng)
currentNumber	Số nguyên	Số lượng bệnh nhân đã đặt hẹn trong khung giờ này (Mặc định 0)
maxNumber	Số nguyên	Số lượng bệnh nhân tối đa cho phép trong khung giờ
date	Chuỗi ký tự	Ngày làm việc (Lưu dạng chuỗi timestamp hoặc định dạng ngày)
timeType	Chuỗi ký tự	Khung giờ làm việc (FK liên kết Allcodes, VD: T1 = 8:00 - 9:00)
doctorId	Số nguyên	Khóa ngoại (FK) định danh Bác sĩ chủ quản khung giờ
clinicId	Số nguyên	Khóa ngoại (FK) định danh cơ sở phòng khám diễn ra
createdAt	Ngày giờ	Thời điểm thiết lập khung giờ
updatedAt	Ngày giờ	Thời điểm cập nhật
Bookings: Lưu trữ giao dịch đặt lịch khám giữa Bệnh nhân và Bác sĩ.
Tên thuộc tính	Kiểu dữ liệu	Mô tả
id	Số nguyên	Mã định danh lịch hẹn (Khóa chính - Tự động tăng)
statusId	Chuỗi ký tự	Trạng thái hiện tại của lịch hẹn (FK liên kết Allcodes, VD: S1, S2)
doctorId	Số nguyên	Khóa ngoại (FK) chỉ định Bác sĩ sẽ khám
patientId	Số nguyên	Khóa ngoại (FK) chỉ định Bệnh nhân đặt lịch
date	Chuỗi ký tự	Ngày hẹn khám
timeType	Chuỗi ký tự	Khung giờ hẹn khám (FK liên kết Allcodes)
token	Chuỗi ký tự	Chuỗi mã hóa bí mật dùng để xác thực Email hoặc Thanh toán
reason	Chuỗi ký tự	Lý do/Triệu chứng bệnh nhân điền khi đặt lịch
createdAt	Ngày giờ	Thời điểm tạo giao dịch đặt lịch
updatedAt	Ngày giờ	Thời điểm cập nhật trạng thái giao dịch
Histories: Lưu trữ kết quả khám bệnh sau khi hoàn tất.
Tên thuộc tính	Kiểu dữ liệu	Mô tả
id	Số nguyên	Mã định danh hồ sơ bệnh án (Khóa chính - Tự động tăng)
patientId	Số nguyên	Khóa ngoại (FK) liên kết tới Bệnh nhân
    doctorId	Số nguyên	Khóa ngoại (FK) liên kết tới Bác sĩ trực tiếp chẩn đoán
description	Chuỗi ký tự	Ghi chú của bác sĩ, đơn thuốc, lời dặn dò
files	Chuỗi ký tự	Chuỗi mã hóa (Base64/Link) của các tài liệu đính kèm (X-quang, xét nghiệm)
createdAt	Ngày giờ	Ngày giờ hoàn tất khám bệnh
updatedAt	Ngày giờ	Ngày giờ cập nhật hồ sơ
Messages: Lưu trữ dữ liệu tin nhắn trò chuyện theo thời gian thực giữa bác sĩ và bệnh nhân.
Tên thuộc tính	Kiểu dữ liệu	Mô tả
id	Số nguyên	Mã định danh tin nhắn (Khóa chính)
senderId	Số nguyên	Mã người gửi tin nhắn (FK liên kết bảng Users)
receiverId	Số nguyên	Mã người nhận tin nhắn (FK liên kết bảng Users)
text	Văn bản dài	Nội dung văn bản của tin nhắn
image	Văn bản dài	Hình ảnh đính kèm trong tin nhắn (Base64)
parentId	Số nguyên	ID của tin nhắn gốc (Phục vụ tính năng Reply/Trả lời)
reactions	Chuỗi ký tự	Chuỗi JSON lưu trữ trạng thái thả cảm xúc (Tim, Like...)
isRead	Đúng/Sai	Trạng thái tin nhắn (True: Đã xem, False: Chưa xem)
Chatbots: Lưu trữ lịch sử giao tiếp giữa bệnh nhân và trợ lý ảo AI, giúp bệnh nhân tra cứu lại đoạn tư vấn cũ.
Tên thuộc tính	Kiểu dữ liệu	Mô tả
id	Số nguyên	Mã định danh (Khóa chính)
userId	Số nguyên	Mã người dùng đang tương tác với AI (FK liên kết Users)
sessionId	Chuỗi ký tự	Mã định danh phiên trò chuyện (Nhóm các tin nhắn lại)
role	Chuỗi ký tự	Vai trò người nhắn (Chỉ nhận "user" hoặc "model")
content	Văn bản dài	Nội dung phản hồi của AI hoặc câu hỏi của bệnh nhân
createdAt	Ngày giờ	Thời điểm nhắn tin
Để có một cái nhìn tổng quát về mối quan hệ giữa các bảng dữ liệu trong cơ sở dữ liệu của hệ thống chúng ta có thể đưa ra sơ đồ quan hệ giữa chúng
 
Hình 3.49. Biểu đồ quan hệ.
3.5.	Phân tích thiết kế giao diện của hệ thống
3.5.1.	Giao diện người dùng
3.5.1.1.	Giao diện trang chủ đặt lịch
Trang này hiển thị các thông tin về chuyên khoa, cơ sở y tế, bác sĩ và cẩm nang giúp bệnh nhân có thể tìm kiếm thông tin một cách tổng quát hơn.
 
Hình 3.50. Giao diện trạng chủ đặt lịch.
Giao diện được chia làm 7 phần chính:
-	Phần 1: Là 3 giao diện trang được chia riêng biệt.
-	Phần 2: Dùng để đăng nhập và thanh tìm kiếm.
-	Phần 3: Nút để có thể chat với bác si và chatbot AI.
-	Phần 4: Nơi hiển thị các chuyên khoa phổ biến thường được chọn.
-	Phần 5: Nơi hiển thị các cơ sơ y tế nổi bật trên hệ thống.
-	Phần 6: Nơi hiển thị các bác sĩ nổi bật được đánh giá cao trên hệ thống.
-	Phần 7: Nơi hiển thị cẩm năng y tế mới nhất
3.5.1.2.	Giao diện trang đặt lịch
Trang này hiển thị chi tiết thông tin về bác si cũng như lịch khám và cơ sơ y tế của bác sĩ đó.
 
Hình 3.51. Giao diện đặ.t lịch
Giao diện  được chia làm 3 phần chính:
-	Phần 1: Đây là nơi hiển thị tên cũng như tất cả các thông tin về bác sĩ như chuyên khoa, số năng kinh nghiệm,……
-	Phần 2: Đây là nơi hiển thị các khung giờ khám mà bệnh nhân có thể chọn cùng ngày khám. Những khung giờ không còn chỗ trống sẽ không được hiển thị lên.
-	Phần 3: Đây là nơi hiển thị chi tiết phòng khám mà bác sĩ đó hiện đang công tác.
3.5.1.3.	Giao diện trang ChatBox
Giao diện này giúp cho bệnh nhân có thế nhắn tin trực tiếp với bác sĩ cũng như AI để có thể hỏi về các triệu chứng hoặc dịch vụ.
 
Hình 3.52. Giao diện ChatBox.
Giao diện được chia làm 3 phần:
-	Phần 1: Đây là nơi phân loại các mục tin nhắn được chia ra là: Tất cả, Đã đọc, Chưa đọc và AI Support.
-	Phần 2: Đây là nơi hiển thị các cuộc hội thoại đã có.
-	Phần 3: Đây là nơi hiện thị chi tiết lịch sử cho chuyện của bệnh nhân với từng người được chọn.
3.5.1.4.	Giao diện quản lý thông tin cá nhân và bảo mật
Đây là giao diện giúp cho người dùng quản lý, chỉnh sửa thông tin cá nhân và thay đổi mật khẩu
 
Hình 3.53. Giao diện quản lý thông tin cá nhân và bảo mật.
Giao diện được chia làm 2 phần:
-	Phần 1: Nơi hiển thị thông tin người dùng và có thể thay đổi các thông tin đó.
-	Phần 2: Ấn để có thể lưu đã sửa.
3.5.1.5.	Giao diện quản lý lịch hẹn cá nhân
Giao diện này giúp bệnh nhân có thể quản lý thông tin các lịch hẹn mà bản thân đã đặt.
 
Hình 3.54. Giao diện quản lý lịch hẹn cá nhân.
Giao diện được chia làm 1 phần:
-	Phần 1: Đây là nơi hiển thị các lịch hẹn đã đặt và trạng thái hiện tại của lịch hẹn đó.
3.5.1.6.	Giao diện quản lý lịch sử khám bệnh
Giao diện này giúp bệnh nhân có thể xem lịch sử lịch hẹn của cá nhân bệnh nhân.
 
Hình 3.55. Giao diện quản lý lịch sử khám bệnh.
Giao diện được chia làm 1 phần:
-	Phần 1: Đây là nơi hiển thi thông tin lịch sử lịch hẹn mà bệnh nhân đã đặt.
3.5.2.	Giao diện Quản trị viên
3.5.2.1.	Giao diện chức năng quản lý người dùng
Đây là chức năng giúp cho quản trị viện quản lý, phân quyền và thêm sửa xóa người dùng.
 
Hình 3.56. Giao diện người dùng.
Giao diện được chia làm 3 phần:
-	Phần 1: Nút giúp quản trị viên có thể thêm người dùng mới với from tên, SĐT, địa chỉ, email, giới tính và vai trò.
-	Phần 2: Nơi hiển thị tất cả các tài khoản người dùng được giới hạn và chia ra các trang.
-	Phần 3: Hiển thị danh sách các chức năng của quản trị viên.
3.5.2.2.	Giao diện quản lý bác sĩ
Giao diện này giúp Quản trị viên thông tin chi tiết của từng bác sĩ.
 
Hình 3.57. Giao diện quản lý bác sĩ.
Giao diện được chia làm 2 phần
-	Phần 1: Đây là nơi Quản trị viên có thể chọn bác sĩ, xem và thay đổi thông tin của bác sĩ.
-	Phần 2: ấn nút để lưu các thông tin đã đươc chỉnh sửa.
3.5.2.3.	Giao diện quản lý cơ sở y tế
Giao diện này giúp Quản trị viên quản lý thông tin các cơ sở y tế.
 
Hình 3.58. Giao diện quản lý cơ sở y tế.
Giao diện gồm 3 phần:
-	Phần 1: Đây là nơi giúp quản trị viên tìm kiếm cơ sở y tế cần thay đổi thông tin.
-	Phần 2: Nút này giúp Quản trị viện có thể thêm cơ sở mới.
-	Phần 3: Đây là nơi hiển thị các thông tin cơ sở y tế.
3.5.2.4.	Giao diện quản lý chuyên khoa
Giao diện này giúp quản trị viên quản lý và thay đổi thông tin chuyên khoa.
 
Hình 3.59. Giao diện quản lý chuyên khoa.
Giao diện gồm 3 phần:
-	Phần 1: Đây là nơi giúp quản trị viên tìm kiếm chuyên khoa cần thay đổi thông tin.
-	Phần 2: Nút này giúp Quản trị viện có thể thêm chuyên khoa mới.
-	Phần 3: Đây là nơi hiển thị các thông tin chuyên khoa.
3.5.2.5.	Giao diện quản lý cẩm nang
Giao diện này giúp quản trị viên quản lý và thay đổi thông tin cẩm nang.
 
Hình 3.60. Giao diện quản lý cẩm nang.
Giao diện gồm 3 phần:
-	Phần 1: Đây là nơi giúp quản trị viên tìm kiếm cẩm nang cần thay đổi thông tin.
-	Phần 2: Nút này giúp Quản trị viện có thể thêm cẩm nang mới.
-	Phần 3: Đây là nơi hiển thị các thông tin cẩm nang.
3.5.2.6.	Giao diện quản lý lịch khám của bác sĩ
Giao diện giúp quản trị viên chọn bác sĩ và khung giờ, ngày khám mong muốn.
 
Hình 3.61. Giao diện quản lý khám của bác sĩ.
Giao diện gồm 3 phần:
-	Phần 1: Đây là nợi giúp Quản trị viên chọn bác sĩ muốn thay đổi lịch khám.
-	Phần 2: Đây là nơi giúp Quản trị viên chọn một này khám trên lịch.
-	Phần 3: Đây là nơi giúp Quản trị viên chọn khung giờ khám bênh sau khi đã chọn ngày cần thay đổi.
3.5.2.7.	Giao diện quản lý tin nhắn nhanh
Giao diện này cho phép Quản trị viên quản lý và thay đổi các tin nhắn nhanh để bác sĩ có thể sử dụng.
 
Hình 3.62. Giao diện quản lý tin nhắn nhanh.
Giao diện gồm 2 phần:
-	Phần 1: Đây là nơi Quản trị viên có thể thêm mẫu tin nhắn nhanh mới.
-	Phần 2: Đây là nơi hiển thị thông tin các tin nhắn nhanh đã tạo.
3.5.2.8.	Giao diện quản lý mẫu Email tự động
Giao diện này cho phép Quản trị viên quản lý và thay đổi các mẫu Emaul tự động để gửi cho bệnh nhân.
 
Hình 3.63. Giao diện quản lý mẫu Email tự động
 
Giao diện gồm 2 phần:
-	Phần 1: Đây là nơi Quản trị viên có thể thêm mẫu Email mới.
-	Phần 2: Đây là nơi hiển thị thông tin các mẫu Email đã tạo.
3.5.3.	Giao diện bác sĩ
3.5.3.1.	Giao diện quản lý bệnh nhân
Giao diện này giúp bác sĩ có thể xem các lịch hẹn còn lai trong ngày đã chọn.
 
Hình 3.64. Giao diện quản lý bệnh nhân.
Giao diện gồm 2 phần:
-	Phần 1: Đây là nơi Bác sĩ ngày hoặc tên của bệnh nhân để tìm kiếm nhanh.
-	Phần 2: Đây là nơi hiển thị các thông tin lịch hẹn còn lại của bác sĩ.
CHƯƠNG 4.	TRIỂN KHAI HỆ THỐNG 
VÀ THỰC NGHIỆM
4.1.	Môi trường triển khai hệ thống
4.1.1.	Công cụ phát triển
-	Visual Studio Code (VS Code): là môi trường phát triển tích hợp (IDE) nhẹ, hỗ trợ nhiều ngôn ngữ lập trình, đặc biệt phù hợp với JavaScript. VS Code cung cấp nhiều extension hỗ trợ như
	ESlint (Kiểm tra lỗi code)
	Prettier (format code)
	REST Client (test API)
-	Postman: được sử dụng để kiểm thử các API trong quá trình phát triển backend. Công cụ này giúp gửi request HTTP (GET, POST, PUT, DELETE) và kiểm tra phản hồi từ server.
-	Git và GitHub: dùng để quản lý mã nguồn và làm việc nhóm. Git hỗ trợ kiểm soát phiên bản, trong khi GitHub giúp lưu trữ và chia sẻ code.
-	MySQL Workbench: công cụ hỗ trợ thiết kế và quản lý cơ sở dữ liệu MySQL, cho phép tạo bảng, viết truy vấn và quản lý dữ liệu trực tiếp
4.1.2.	Framework và công nghệ sử dụng
4.1.2.1.	Backend – Node.js (ExpressJS)
-	Node.js: là môi trường chạy JavaScript phía Server, cho phép xây dựng các ứng dụng web hiệu năng cao và xử lý bất đồng bộ tốt.
-	ExpressJS: là framework phổ biến của Node.js, giúp xây dựng RESTful API một cách nhanh chóng và linh hoạt. ExpressJS hỗ trợ
	Routing (định tuyến API)
	Middleware (xử lý request)
	Tích hợp dễ dàng với database
-	JWT (JSON Web Token): được sử đụng để xác thực và phân quyền người dùng trong hệ thống. JWT giúp đảm bảo tính bảo mật và xác thực trong các request giữa client và Server
4.1.2.2.	Frontend – ReactJS
-	ReactJS: là thư viện JavaScript dùng để xây dựng giao diện người dùng (UI). React sử dụng cơ chế component giúp tái tạo sử dụng code và tăng khả năng bảo trì.
-	Các đặc điểm nổi bật:
	Virtual DOM giúp tăng hiệu năng 
	Tách biệt UI thành các component nhỏ
	Dễ dàng kết nối với API backend 
-	React được sử dụng để xây dựng các giao diện:
	Trang đăng nhập/đăng ký
	Trang danh sách bác sĩ
	Trang danh sách chuyên khoa
	Trang danh sách cơ sở y tế
	Trang quản trị hệ thống 
	Trang bác sĩ
4.1.3.	Hệ quản trị cơ sở dữ liệu
-	MySQL: là hệ quản trị cơ sở dữ liệu quản hệ (RDBMS) phổ biến, được sử dụng để lưu trữ toàn bộ dữ liệu của hệ thống .
-	Các dữ liệu chính bao gồm:
	Người dùng
	Bác sĩ 
	Chuyên khoa
	Lịch khám 
	Đơn đặt lịch 
	Thanh toán 
-	Ưu điểm của MySQl:
	Hiệu năng ổn định 
	Dễ sử dụng 
	Hỗ trợ tốt cho ứng dụng web
	Khả năng mở rộng cao
4.2.	Cài đặt và triển khai hệ thống
4.3.	Kiểm thử hệ thống
4.3.1.	Kiểm thử đơn vị (Unit Test)
Kiểm thử đơn vị là một loại kiểm thử phần mềm trong đó thực hiện kiểm thử từng đơn vị hoặc thành phần riêng lẻ của phần mềm. Mục đích của việc kiểm thử đơn vị là để xác nhận rằng mỗi đơn vị hay mã code của phần mềm được thực hiện chức năng của chúng đúng như mong đợi. Kiểm thử đơn vị được thực hiện trong quá trình phát triển (giai đoạn thực hiện code) của web. Kiểm thử đơn vị sẽ thực hiện kiểm thử độc lập một phần code và xác minh tính chính xác của nó. Một đơn vị có thể là một chức năng, một phương thức, thủ tục, module hoặc đối tượng riêng lẻ.
Trong hệ thống, kiểm thử đơn vị được áp dụng chủ yếu cho các module backend như: 
-	Xử lý đăng nhập và xác thực JWT
-	Kiểm tra dữ liệu đầu vào (validation)
-	Xử lý logic đặt lịch khám
-	Các hàm truy vấn cơ sở dữ liệu.
4.3.2.	Kiểm thử tích hợp (Integration Testing)
Kiểm thử tích hợp được định nghĩa là một loại kiểm thử trong đó các module phần mềm được tích hợp một cách hợp lý và được thử nghiệm dưới dạng một nhóm. Mục đích của cấp độ kiểm thử này là để lộ ra các khiếm khuyết (lỗi) trong tương tác giữa các module phần mềm khi chúng được tích hợp với nhau.
Kiểm thử tích hợp tập trung vào kiểm tra giao tiếp dữ liệu giữa các module. Do đó, nó cũng được gọi là ‘I & T’ (Tích hợp và kiểm tra), ‘Kiểm tra chuỗi’ và đôi khi là ‘Kiểm tra luồng’.
Măc dù từng module phần mềm sẽ được Unit Test (Kiểm thử đơn vị), nhưng lỗi vẫn sẽ tồn tại nhiều lý do như:
-	Kiểm thử tích hợp là cần thiết để xác minh các module phần mềm hoạt động cùng nhau một cách nhất quán
-	Tại thời điểm phát triển module, sẽ có lúc đưa ra những thay đổi về yêu cầu. các yêu cầu mới này có thể không được Unit Test và do đó kiểm thử tích hợp hệ thống trở nên cần thiết
-	Các giao diện của các module phần mềm cùng với cơ sở dữ liệu có thể bị lỗi
-	Xử lý những trường hợp ngoại lệ một cách không phù hợp có thể gây ra cấc vấn đề khác 
Trong đề tài, kiểm thử tích hợp được thực hiện thông qua việc:
-	Gửi request từ frontend đến backend 
-	Backend xử lý và truy vấn dữ liệu từ MySQL 
-	Trả kết quả về frontend để hiển thị
4.3.3.	Kiểm thử hệ thống (System Testing)
Kiểm thử hệ thống là một phương pháp theo dõi và đánh giá hành vi của sản phẩm hoàn chỉnh và đã được tích hợp đầy đủ, dựa vào đặc tả và các yêu cầu chức năng đã được xác định trước.
Kiểm thử hệ thống được thực hiện trong hộp đen, tức là chỉ có các tính năng làm việc bên ngoài của phần mềm được đánh giá trong quá trình thử nghiệm này. Nó không đòi hỏi bất cứ kiến thức nội bộ nào về coding, thiết kế,.. và hoàn toàn dựa trên quan điểm của người dùng.
Các chức năng chính được kiểm thử bao gồm:
-	Đăng ký/đăng nhập
-	Tìm kiếm
-	Xem thông tin bác sĩ
-	Đặt lịch khám
-	Hủy lịch khám 
-	Thanh toán
-	Đánh giá bác sĩ
-	Quản lý dữ liệu
 
KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
1. Kết luận
Sau một thời gian nghiêm túc nghiên cứu, phân tích và tiến hành xây dựng, đề tài “Xây dựng hệ thống quản lý đặt lịch khám bệnh và tư vấn trực tuyến thời gian thực” đã cơ bản hoàn thành và đặt được những mục tiêu ban đầu đề ra. Chuyên đề đã đạt được những kết quả nổi bật sau:
-	Về mặt lý thuyết: Tìm hiểu và áp dụng thành công quy trình phân tích thiết kế hệ thống phần mềm chuyên nghiệp. Áp dụng chuẩn xác các biểu đồ UML, DFD để mô hình hóa quy trình nghiệp vụ của một phòng khám/bệnh viện ngoài thực tế.
-	Về mặt công nghệ: Xây đựng thành công hệ thống với mô hình Client-Server hiện đại, sử dụng ReactJS cho Frontend, Node.js (Express) cho Backend và MySQl làm hệ quản trị cơ sở dữ liệu.
-	Về mặt chức năng hệ thống:
	Hoàn thiện luồng nghiệp vụ cốt lõi: Đặt lịch khám, quản lý chuyên khoa, quản lý phòng khám, quản lý hồ sơ bác sĩ và phân quyền người dùng (Admin, Bác sĩ, Bệnh nhân).
	Tích hợp thành công các tiện ích nâng cao: Hệ thống thanh toán trực tuyến qua mã QR (Cổng PayOS) và hệ thống xác thực bảo mật qua mã OTP Email.
	Xây dựng hệ thống giao tiếp theo thời gian thực (Real-time) sử dụng Socker.io, cho phép bệnh nhân và Bác sĩ nhắn tin, gửi kết quả khám/đơn thuốc trực tiếp cho nhau.
	Bước đầu tích hợp thành công Trợ lý ảo AI Chatbot vào hệ thống để hỗ trợ giải đáp thắc mác và phân luồng bệnh nhân.
2. Hạn chế của hệ thống
Bên cạnh những kết quả đã đạt được, do giới hạn về thời gian cũng như nguồn lực nghiên cứu, hệ thống hiện tại vẫn còn tồn tại một số hạn chế nhất định:
-	Về AI Chatbot: Tính năng trợ lý ảo hiện tại mới dừng lại ở mức độ tư vấn sức khỏe tổng quát dựa trên các mô hình ngôn ngữ (LLM) có sẵn. AI chưa được huấn luyện chuyên sâu bằng dữ liệu y khoa đặc thù (Fine-tuning) của riêng hệ thống, do đó chưa thể đưa ra các chẩn đoán hoặc phác đồ điều trị cá nhân hóa có độ chính xác cao.
-	Về trải nghiệm tư vấn bệnh từ xa (Telemedicine): Hệ thống giao tiếp hiện tại chỉ mới hỗ trợ dạng tin nhắn văn bản và hình ảnh, chưa hỗ trợ tính năng gọi video trực tuyến giữa bác sĩ và bệnh nhân.
-	Về thanh toán: Luồng thanh toán trực tuyến qua PayOS đã hoạt động ổn định nhưng chưa có cơ chế tự động hoàn tiền. Trong trường hợp bác sĩ đột xuất hủy lịch khám, thao tác hoàn tiền đang phải xử lý thủ công bởi Quản trị viên.
-	Về mền tảng: Hệ thống mới chỉ hoạt động dưới dạng Web Responsive (hiển thị tốt trên trình duyệt điện thoại), chưa có ứng dụng di động độc lập trên nền tảng IOS/Android.
   3. Hướng phát triển trong tương lai
Để khác phục những hạn chế nêu trên và đưa hệ thống vào ứng dụng rộng rãi hơn trong thực tế, nhóm em đề xuất một số hướng phát triển và mở rộng trong tương lai như sau:
-	Hoàn thiện và nâng cấp Trợ lý ảo Ai Chatbot:
	Tích hợp công nghệ RAG (Retrieval-Augmented Generation) kết hợp với kho dữ liệu bệnh án điện tử của hệ thống. Trong tương lai, AI Chatbot không chỉ là người trả lời tự động mà sẽ đóng vai trò như một “Y tá ảo” thực thụ.
	Ai sẽ có khả năng tự động tóm tắt lịch sử bệnh án, phân tích các chỉ số xét nghiệm cũ của bệnh nhân để báo cáo nhanh cho bác sĩ trước khi vào ca khám. Đồng thời, AI sẽ tự động chủ động nhắn tin nhắc nhở bệnh nhân lịch uống thuốc và tái khám.
-	Phát triển ứng dụng di động: Xây dựng ứng dụng di động bằng React Native hoặc Flutte để đưa sản phẩn lên App Store và Google Play. Việc có App riêng sẽ giúp hệ thống sử dụng được tính năng thông báo đẩy, giúp bệnh nhân có thể nhận thông báo lịch khám tiện lợi hơn việc check Email.
-	Tích hợp tính năng tư vấn bệnh từ xa qua Video: Ứng dụng công nghệ WebRTC để xây dựng module Video Call ngay trên hệ thống. Tính năng này sẽ phục vụ cho các ca tái khám, tư vấn tâm lý hoặc các bệnh ngoài da không cần phải đến trực tiếp phòng khám.
-	Mở rộng hệ sinh thái thanh toán: Tích hợp đa dạng các cổng thanh toán phổ biến tại Việt Nam như ví Momo, ZaloPay, VNPay và tự động hóa quá trình đối soát, hoàn tiền khi có sự thay đổi về lịch khám
 
TÀI LIỆU THAM KHẢO
[1] Trần Đình Quế (2013). Giáo trình phân tích và thiết kế hệ thống thông tin. NXB Học viên Công nghệ Bưu chính viễn thông.
[2]

