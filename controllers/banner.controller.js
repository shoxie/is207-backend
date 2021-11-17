const { Category } = require("../models/category.model");
const prisma = require("../models/index");

async function getAllCategory(req, res, next) {
  prisma.category
    .findMany()
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => res.status(400).send({ message: err.message }));
}

async function postNewCategory(req, res, next) {
  // const newCategory = new Category(req.body);
  // newCategory
  //   .save()
  //   .then(() => {
  //     res.status(200).send({ message: "Crate category successfully" });
  //   })
  //   .catch((error) => {
  //     res.status(400).send({ message: error.name });
  //   });
  prisma.category
    .create({
      data: req.body,
    })
    .then(() =>
      res.status(200).send({ message: "Crate category successfully" })
    )
    .catch((error) => res.status(400).send({ message: error.name }));
}

async function getBanners(req, res, next) {
  const { limit } = req.query
  prisma.banner.findMany({
    take: limit
  })
    .then((category) => {
      res.status(200).json(category);
    })
    .catch((err) => res.status(400).send({ message: err.message }));
}
module.exports = {
  getBanners,
};
