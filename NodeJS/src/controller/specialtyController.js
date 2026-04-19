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
let getSpecialtyById = async (req, res) => {
    try {
        let infor = req.query.id;
        let response = await specialtyService.getSpecialtyByIdService(infor);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
}

let handleDeleteSpecialty = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters!"
            })
        }
        let response = await specialtyService.deleteSpecialtyService(req.body.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleEditSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.editSpecialtyService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
export default {
    postCreateNewSpecialty: postCreateNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    getSpecialtyById: getSpecialtyById,
    handleDeleteSpecialty: handleDeleteSpecialty,
    handleEditSpecialty: handleEditSpecialty
}