import patientService from '../services/patientService'

let postBookAppointment = async (req, res) => {
    try {
        let infor = req.body;
        console.log('infor body', infor);
        let response = await patientService.postBookAppointmentService(infor);
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
    postBookAppointment,
}