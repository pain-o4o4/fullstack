import searchService from '../services/searchService';

const handleGlobalSearch = async (req, res) => {
    try {
        const keyword = req.cleanedKeyword; // From validateSearch middleware
        if (!keyword) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            });
        }

        let searchData = await searchService.searchAll(keyword);
        return res.status(200).json(searchData);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        });
    }
}

export default {
    handleGlobalSearch
}
