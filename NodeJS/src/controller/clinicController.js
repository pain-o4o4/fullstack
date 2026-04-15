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
module.exports = {
    postCreateNewClinic: postCreateNewClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById

}