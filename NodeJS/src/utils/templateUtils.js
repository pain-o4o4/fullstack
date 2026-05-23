/**
 * Thay thế các placeholder dạng {{key}} bằng dữ liệu thật từ object data
 * @param {string} template - Chuỗi chứa placeholder
 * @param {object} data - Object chứa dữ liệu thay thế
 * @returns {string} - Chuỗi đã được thay thế dữ liệu
 */
const replacePlaceholders = (template, data) => {
    if (!template) return '';
    return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
        const value = data[key.trim()];
        return value !== undefined ? value : match;
    });
};

module.exports = {
    replacePlaceholders: replacePlaceholders
};
