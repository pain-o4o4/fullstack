import db from "../../models/index";

/**
 * LƯU HOẶC KHÔI PHỤC LỊCH SỬ TÌM KIẾM
 * Nếu từ khóa đã có sẵn (kể cả đã bị xóa mềm trước đó): Khôi phục lại (deletedAt = null) và cập nhật thời gian.
 * Nếu chưa có: Tạo mới hoàn toàn.
 */
const saveSearchHistory = async (userId, keyword) => {
    try {
        if (!userId || !keyword || !keyword.trim()) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameters'
            };
        }
        const cleanKeyword = keyword.trim();

        // Tìm kiếm cả những bản ghi đã bị xóa mềm (paranoid: false) để tái sử dụng
        let history = await db.SearchHistory.findOne({
            where: { userId, keyword: cleanKeyword },
            paranoid: false,
            raw: false
        });

        if (history) {
            // Khôi phục bản ghi đã xóa mềm & cập nhật thời gian đẩy lên top đầu
            history.deletedAt = null;
            history.changed('deletedAt', true);
            await history.save({ paranoid: false });
        } else {
            // Tạo mới nếu chưa từng tìm
            await db.SearchHistory.create({
                userId,
                keyword: cleanKeyword
            });
        }

        return {
            errCode: 0,
            errMessage: 'Search history saved successfully'
        };
    } catch (e) {
        console.error(">>> Lỗi saveSearchHistory:", e);
        return {
            errCode: -1,
            errMessage: 'Error from server'
        };
    }
};

/**
 * LẤY DANH SÁCH LỊCH SỬ TÌM KIẾM GẦN NHẤT
 * Chỉ lấy các bản ghi chưa bị xóa mềm (deletedAt = null), sắp xếp từ mới đến cũ.
 */
const getSearchHistory = async (userId) => {
    try {
        if (!userId) {
            return {
                errCode: 1,
                errMessage: 'Missing userId parameter',
                data: []
            };
        }

        const data = await db.SearchHistory.findAll({
            where: { userId },
            attributes: ['id', 'keyword', 'updatedAt'],
            order: [['updatedAt', 'DESC']],
            limit: 6 // Giới hạn lấy 6 từ khóa tìm gần nhất cho UI tối giản
        });

        return {
            errCode: 0,
            data
        };
    } catch (e) {
        console.error(">>> Lỗi getSearchHistory:", e);
        return {
            errCode: -1,
            errMessage: 'Error from server',
            data: []
        };
    }
};

/**
 * XÓA MỀM MỘT MỤC LỊCH SỬ TÌM KIẾM (SOFT DELETE ITEM)
 */
const deleteSearchHistoryItem = async (userId, id) => {
    try {
        if (!userId || !id) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameters'
            };
        }

        await db.SearchHistory.destroy({
            where: { id, userId }
        });

        return {
            errCode: 0,
            errMessage: 'Search history item soft-deleted successfully'
        };
    } catch (e) {
        console.error(">>> Lỗi deleteSearchHistoryItem:", e);
        return {
            errCode: -1,
            errMessage: 'Error from server'
        };
    }
};

/**
 * XÓA MỀM TOÀN BỘ LỊCH SỬ TÌM KIẾM CỦA USER (SOFT DELETE ALL)
 */
const clearSearchHistory = async (userId) => {
    try {
        if (!userId) {
            return {
                errCode: 1,
                errMessage: 'Missing userId parameter'
            };
        }

        await db.SearchHistory.destroy({
            where: { userId }
        });

        return {
            errCode: 0,
            errMessage: 'All search history soft-deleted successfully'
        };
    } catch (e) {
        console.error(">>> Lỗi clearSearchHistory:", e);
        return {
            errCode: -1,
            errMessage: 'Error from server'
        };
    }
};

export default {
    saveSearchHistory,
    getSearchHistory,
    deleteSearchHistoryItem,
    clearSearchHistory
};
