import handbookService from "../services/handbookService";

let createHandbook = async (req, res) => {
    try {
        let response = await handbookService.createHandbook(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log("Check createHandbook error: ", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        });
    }
};

let getAllHandbook = async (req, res) => {
    try {
        let response = await handbookService.getAllHandbook();
        return res.status(200).json(response);
    } catch (e) {
        console.log("Check getAllHandbook error: ", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        });
    }
};

let getDetailHandbookById = async (req, res) => {
    try {
        let response = await handbookService.getDetailHandbookById(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log("Check getDetailHandbookById error: ", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        });
    }
};

let deleteHandbook = async (req, res) => {
    try {
        let response = await handbookService.deleteHandbook(req.body.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log("Check deleteHandbook error: ", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let handleEditHandbook = async (req, res) => {
    try {
        let data = req.body;
        let resData = await handbookService.updateHandbookData(data);
        return res.status(200).json(resData);
    } catch (e) {
        console.log("Check handleEditHandbook error: ", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

export default {
    createHandbook,
    getAllHandbook,
    getDetailHandbookById,
    deleteHandbook,
    handleEditHandbook
};
