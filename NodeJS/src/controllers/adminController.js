import adminService from "../services/adminService";

let handleGetAllEmailTemplates = async (req, res) => {
    try {
        let data = await adminService.getAllEmailTemplates();
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let handleUpsertEmailTemplate = async (req, res) => {
    try {
        let data = await adminService.upsertEmailTemplate(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let handleDeleteEmailTemplate = async (req, res) => {
    try {
        let data = await adminService.deleteEmailTemplate(req.query.id);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let handleGetAllGlobalQuickReplies = async (req, res) => {
    try {
        let data = await adminService.getAllGlobalQuickReplies();
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let handleUpsertGlobalQuickReply = async (req, res) => {
    try {
        let data = await adminService.upsertGlobalQuickReply(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

module.exports = {
    handleGetAllEmailTemplates: handleGetAllEmailTemplates,
    handleUpsertEmailTemplate: handleUpsertEmailTemplate,
    handleDeleteEmailTemplate: handleDeleteEmailTemplate,
    handleGetAllGlobalQuickReplies: handleGetAllGlobalQuickReplies,
    handleUpsertGlobalQuickReply: handleUpsertGlobalQuickReply
};
