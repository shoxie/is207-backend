async function getAllCategory(req, res, next) {
    try {
        const category = await categoryModel.find();
        res.status(200).json({
            data: category,
            message: 'Success'
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    getAllCategory
}