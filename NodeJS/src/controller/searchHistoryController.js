import searchHistoryService from '../services/searchHistoryService';

const handleSaveSearchHistory = async (req, res) => {
    try {
        const { userId, keyword } = req.body;
        const result = await searchHistoryService.saveSearchHistory(userId, keyword);
        return res.status(200).json(result);
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const handleGetSearchHistory = async (req, res) => {
    try {
        const { userId } = req.query;
        const result = await searchHistoryService.getSearchHistory(userId);
        return res.status(200).json(result);
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
            data: []
        });
    }
};

const handleDeleteSearchHistoryItem = async (req, res) => {
    try {
        const { userId, id } = req.body;
        const result = await searchHistoryService.deleteSearchHistoryItem(userId, id);
        return res.status(200).json(result);
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

const handleClearSearchHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        const result = await searchHistoryService.clearSearchHistory(userId);
        return res.status(200).json(result);
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

export default {
    handleSaveSearchHistory,
    handleGetSearchHistory,
    handleDeleteSearchHistoryItem,
    handleClearSearchHistory
};
