import clinicService from "../services/clinicService";




let postCreateNewClinic = async (req, res) => {
    try {
        let infor = req.body;
        console.log('infor body', infor);
        let response = await clinicService.postCreateNewClinicService(infor);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
            errPin: JSON.stringify(error)
        });
    }
}
let getAllClinic = async (req, res) => {
    try {
        let response = await clinicService.getAllClinicService();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
            errPin: JSON.stringify(error)
        });
    }
}
let getDetailClinicById = async (req, res) => {
    try {
        let infor = req.query.id;
        let response = await clinicService.getDetailClinicByIdService(infor);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
            errPin: JSON.stringify(error)
        });
    }
}
let handleDeleteClinic = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters!"
            })
        }
        let response = await clinicService.deleteClinicService(req.body.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleEditClinic = async (req, res) => {
    try {
        let response = await clinicService.editClinicService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    postCreateNewClinic: postCreateNewClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    handleDeleteClinic: handleDeleteClinic,
    handleEditClinic: handleEditClinic
}