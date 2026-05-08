import systemService from "../services/systemService";

let getSystemStatistics = async (req, res) => {
    try {
        let data = await systemService.getSystemStatisticsService();
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

export default {
    getSystemStatistics
};
