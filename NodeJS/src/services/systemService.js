import db from "../../models/index";
import { Op } from "sequelize";

/**
 * Lấy các số liệu thống kê tổng hợp của hệ thống
 * Thay vì tải toàn bộ data về đếm (gây chậm), dùng lệnh COUNT trực tiếp trong DB.
 */
let getSystemStatisticsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Đếm số lượng bác sĩ (Role R2)
            let numDoctors = await db.User.count({
                where: { roleId: 'R2' }
            });

            // 2. Đếm số lượng phòng khám (Clinics)
            let numClinics = await db.Clinic.count();

            // 3. Đếm số lượng bệnh nhân (Role R3)
            let numUsers = await db.User.count({
                where: { roleId: 'R3' }
            });

            // 4. Lấy thống kê theo tỉnh thành (Cho bản đồ mạng lưới)
            // Lấy danh sách tỉnh thành trước
            let provinces = await db.Allcode.findAll({
                where: { type: 'PROVINCE' },
                attributes: ['keyMap', 'valueVi', 'valueEn'],
                raw: true
            });

            // Với mỗi tỉnh, đếm số phòng khám có địa chỉ chứa tên tỉnh đó
            // Lưu ý: Đây là cách đếm dựa trên string matching vì DB hiện tại 
            // lưu địa chỉ là 1 chuỗi text trong bảng Clinic.
            let provinceStats = await Promise.all(provinces.map(async (prov) => {
                let searchKeywords = [prov.valueVi];
                if (prov.valueVi === 'Hồ Chí Minh') searchKeywords.push('TP.HCM', 'HCM', 'Hồ Chí Minh');
                if (prov.valueVi === 'Hà Nội') searchKeywords.push('HN', 'Hà Nội');
                if (prov.valueVi === 'Đà Nẵng') searchKeywords.push('ĐN', 'Đà Nẵng');

                let count = await db.Clinic.count({
                    where: {
                        address: {
                            [Op.or]: searchKeywords.map(kw => ({ [Op.like]: `%${kw}%` }))
                        }
                    }
                });

                let label = prov.valueVi;
                if (label === 'Hồ Chí Minh') label = 'HCM';
                else if (label === 'Hà Nội') label = 'HN';
                else if (label === 'Đà Nẵng') label = 'ĐN';
                else if (label === 'Cần Thơ') label = 'CT';
                else if (label === 'Hải Phòng') label = 'HP';
                else {
                    label = label.split(' ').map(w => w.charAt(0)).join('').toUpperCase();
                }

                return {
                    id: prov.keyMap,
                    label: label,
                    fullName: prov.valueVi,
                    count: count
                };
            }));

            // Lọc các tỉnh có ít nhất 1 phòng khám và sắp xếp
            provinceStats = provinceStats
                .filter(p => p.count > 0)
                .sort((a, b) => b.count - a.count)
                .slice(0, 6);

            resolve({
                errCode: 0,
                data: {
                    numDoctors,
                    numClinics,
                    numUsers,
                    provinceStats
                }
            });

        } catch (error) {
            reject(error);
        }
    });
};

export default {
    getSystemStatisticsService
};
