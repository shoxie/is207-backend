const { Category } = require("../models/category.model");

async function getAllCategory(req, res, next) {
  try {
    const category = await categoryModel.find();
    res.status(200).json({
      data: category,
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
}

async function postNewCategory(req, res, next) {
  const newCategory = new Category(req.body);
  newCategory
    .save()
    .then(() => {
      res.status(200).send({ message: "Crate category successfully" });
    })
    .catch((error) => {
      res.status(400).send({ message: error.name });
    });
}
module.exports = {
  getAllCategory,
  postNewCategory,
};
