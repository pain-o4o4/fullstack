'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Xóa dữ liệu cũ
        await queryInterface.bulkDelete('schedules', null, {});

        // Lấy danh sách bác sĩ (roleId = 'R2')
        const doctors = await queryInterface.sequelize.query(
            `SELECT id FROM User WHERE roleId = 'R2';`
        );

        if (doctors[0].length === 0) return;

        let schedulesToInsert = [];
        let timeTypes = ['T1', 'T2', 'T3', 'T4', 'T5']; // Sáng, chiều tùy ý

        // Lấy ngày hôm nay làm gốc (tính ở 0h00)
        let now = new Date();
        now.setHours(0, 0, 0, 0);

        // Chạy vòng lặp cho tất cả bác sĩ
        for (let i = 0; i < doctors[0].length; i++) {
            let doctorId = doctors[0][i].id;

            // Tạo lịch cho 30 ngày tới
            for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
                let targetDate = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
                let dateStr = targetDate.getTime().toString(); // Lưu timestamp string giống format của hệ thống (nếu dùng format cũ)
                
                // Ở Nodejs của bạn, getScheduleByDate query format là DD/MM/YYYY. 
                // Khi bulkCreate trong doctorService, nó cũng save string DD/MM/YYYY.
                // Do đó seeder cũng cần lưu định dạng DD/MM/YYYY để Frontend getScheduleByDate khớp được!
                let dd = String(targetDate.getDate()).padStart(2, '0');
                let mm = String(targetDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
                let yyyy = targetDate.getFullYear();
                let stringDate = `${dd}/${mm}/${yyyy}`;

                // Tránh quá nhiều lịch, chỉ random gán 2-3 khung giờ mỗi ngày
                let activeTimeTypes = timeTypes.slice(0, 3 + (dayOffset % 2));

                for (let time of activeTimeTypes) {
                    schedulesToInsert.push({
                        currentNumber: 0,
                        maxNumber: 10,
                        date: stringDate, // Lưu theo định dạng DD/MM/YYYY để đồng bộ với queryDate trong service
                        timeType: time,
                        doctorId: doctorId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                }
            }
        }

        if (schedulesToInsert.length > 0) {
            return queryInterface.bulkInsert('schedules', schedulesToInsert);
        }
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('schedules', null, {});
    }
};