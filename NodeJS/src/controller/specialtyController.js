import specialtyService from '../services/specialtyService'

let postCreateNewSpecialty = async (req, res) => {
    try {
        let infor = req.body;
        console.log('infor body', infor);
        let response = await specialtyService.postCreateNewSpecialtyService(infor);
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
let getAllSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.getAllSpecialtyService();
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
export default {
    postCreateNewSpecialty: postCreateNewSpecialty,
    getAllSpecialty: getAllSpecialty
}