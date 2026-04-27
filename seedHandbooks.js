/**
 * Seed script: Insert mock handbook data into the 'handbooks' table
 * Run: node NodeJS/seedHandbooks.js
 */

'use strict';
const path = require('path');

// Load DB models (Sequelize)
const db = require(path.resolve(__dirname, 'NodeJS/models/index'));

const handbookData = [
    {
        name: 'Tương lai của Chăm sóc Y tế Từ xa năm 2026',
        descriptionHTML: `<p>Khám phá cách y tế từ xa đang xóa bỏ rào cản địa lý và mang lại cơ hội tiếp cận chăm sóc sức khỏe công bằng cho phụ nữ và gia đình trên toàn cầu.</p>
        <p>Với sự bùng nổ của công nghệ 5G và trí tuệ nhân tạo, y tế từ xa không còn là khái niệm xa lạ. Các bệnh nhân ở vùng nông thôn xa xôi giờ đây có thể kết nối với bác sĩ chuyên khoa hàng đầu chỉ qua một chiếc điện thoại thông minh.</p>
        <p>Năm 2026, các nền tảng như BookingCare đã giúp hàng triệu người dân tiếp cận dịch vụ tư vấn y tế từ xa, giảm thời gian chờ đợi và chi phí di chuyển đáng kể.</p>`,
        descriptionMarkdown: `# Tương lai của Chăm sóc Y tế Từ xa năm 2026\n\nKhám phá cách y tế từ xa đang xóa bỏ rào cản địa lý...\n\n## Công nghệ thay đổi ngành y\n\nVới sự bùng nổ của công nghệ 5G và trí tuệ nhân tạo, y tế từ xa không còn là khái niệm xa lạ.`,
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000'
    },
    {
        name: 'Hiểu rõ các Mô hình Chăm sóc Thai sản',
        descriptionHTML: `<p>Hướng dẫn toàn diện giúp bạn đưa ra lựa chọn đúng đắn về mô hình chăm sóc thai sản phù hợp với nhu cầu của gia đình.</p>
        <p>Thai sản là hành trình đặc biệt, đòi hỏi sự chăm sóc toàn diện từ dinh dưỡng, vận động đến sức khỏe tâm thần. Tìm hiểu các mô hình chăm sóc và lựa chọn phù hợp với bạn.</p>`,
        descriptionMarkdown: `# Hiểu rõ các Mô hình Chăm sóc Thai sản\n\nHướng dẫn toàn diện giúp bạn đưa ra lựa chọn đúng đắn.`,
        image: 'https://images.unsplash.com/photo-1555252117-426eb85b1946?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Hỗ trợ Sức khỏe Tâm thần cho Cha mẹ mới',
        descriptionHTML: `<p>Cách điều hướng cảnh quan cảm xúc và vượt qua những thách thức tâm lý khi chào đón thành viên mới.</p>
        <p>Trầm cảm sau sinh và lo âu parenting là những vấn đề phổ biến nhưng thường bị bỏ qua. Bài viết này cung cấp các chiến lược thực tế để duy trì sức khỏe tâm thần trong giai đoạn quan trọng này.</p>`,
        descriptionMarkdown: `# Hỗ trợ Sức khỏe Tâm thần cho Cha mẹ mới\n\nCách điều hướng cảnh quan cảm xúc và vượt qua những thách thức tâm lý.`,
        image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Dinh dưỡng thiết yếu trong Thai kỳ',
        descriptionHTML: `<p>Những điều bạn thực sự cần biết về chế độ ăn uống khoa học cho cả mẹ và bé.</p>
        <p>Acid folic, sắt, canxi và DHA - bốn dưỡng chất không thể thiếu trong thai kỳ. Cùng tìm hiểu cách bổ sung hiệu quả qua thực phẩm tự nhiên và các lưu ý quan trọng từ chuyên gia dinh dưỡng.</p>`,
        descriptionMarkdown: `# Dinh dưỡng thiết yếu trong Thai kỳ\n\nNhững điều bạn thực sự cần biết về chế độ ăn uống khoa học.`,
        image: 'https://images.unsplash.com/photo-1490645935967-10de6baed702?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Các mốc phát triển quan trọng của trẻ',
        descriptionHTML: `<p>Những cột mốc phát triển thể chất và trí tuệ quan trọng cần theo dõi trong năm đầu đời của trẻ.</p>
        <p>Từ lần đầu tiên con biết lật, ngồi, đứng đến những từ đầu tiên - mỗi bước phát triển đều là kỳ tích. Hướng dẫn theo dõi và kích thích sự phát triển tối ưu cho bé yêu của bạn.</p>`,
        descriptionMarkdown: `# Các mốc phát triển quan trọng của trẻ\n\nNhững cột mốc phát triển thể chất và trí tuệ quan trọng.`,
        image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Hành trình Điều trị Vô sinh Hiếm muộn',
        descriptionHTML: `<p>Hiểu rõ các lựa chọn y khoa và công nghệ hỗ trợ sinh sản hiện đại.</p>
        <p>IUI, IVF, và các phương pháp hỗ trợ sinh sản tiên tiến đang mang lại hy vọng cho hàng triệu cặp đôi. Tìm hiểu quy trình, chi phí và tỷ lệ thành công của từng phương pháp để đưa ra quyết định sáng suốt nhất.</p>`,
        descriptionMarkdown: `# Hành trình Điều trị Vô sinh Hiếm muộn\n\nHiểu rõ các lựa chọn y khoa và công nghệ hỗ trợ sinh sản hiện đại.`,
        image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Phòng ngừa Tim mạch từ sớm',
        descriptionHTML: `<p>Bệnh tim mạch là nguyên nhân tử vong hàng đầu trên toàn cầu, nhưng phần lớn có thể phòng ngừa được.</p>
        <p>Thay đổi lối sống, kiểm soát huyết áp và cholesterol từ sớm là chìa khóa bảo vệ trái tim khỏe mạnh. Chuyên gia tim mạch của BookingCare chia sẻ những bí quyết đơn giản nhưng hiệu quả.</p>`,
        descriptionMarkdown: `# Phòng ngừa Tim mạch từ sớm\n\nBệnh tim mạch là nguyên nhân tử vong hàng đầu nhưng có thể phòng ngừa.`,
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Sức khỏe Tâm thần thời đại số',
        descriptionHTML: `<p>Tác động của mạng xã hội và thiết bị kỹ thuật số đến sức khỏe tâm thần - và cách cân bằng lành mạnh.</p>
        <p>Nghiên cứu cho thấy thời gian sử dụng màn hình quá nhiều có liên quan đến lo âu và trầm cảm. Tuy nhiên, công nghệ cũng có thể là công cụ mạnh mẽ hỗ trợ sức khỏe tâm thần nếu sử dụng đúng cách.</p>`,
        descriptionMarkdown: `# Sức khỏe Tâm thần thời đại số\n\nTác động của mạng xã hội và thiết bị kỹ thuật số đến sức khỏe tâm thần.`,
        image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800'
    }
];

async function seed() {
    try {
        console.log('Connecting to database...');
        await db.sequelize.authenticate();
        console.log('Connection established successfully.');

        // Check existing count
        const existingCount = await db.Handbook.count();
        console.log(`Existing handbook records: ${existingCount}`);

        if (existingCount > 0) {
            console.log('Data already exists. Skipping insert to avoid duplicates.');
            console.log('If you want to re-seed, run: node seedHandbooks.js --force');
            if (!process.argv.includes('--force')) {
                process.exit(0);
            }
            console.log('Force mode enabled, inserting anyway...');
        }

        let inserted = 0;
        for (const item of handbookData) {
            await db.Handbook.create({
                name: item.name,
                descriptionHTML: item.descriptionHTML,
                descriptionMarkdown: item.descriptionMarkdown,
                image: item.image, // Store URL directly as string
                createdAt: new Date(),
                updatedAt: new Date()
            });
            inserted++;
            console.log(`✅ Inserted: ${item.name}`);
        }

        console.log(`\n✅ Done! Inserted ${inserted} handbooks successfully.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
