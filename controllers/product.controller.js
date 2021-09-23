const { getAllProducts, Product } = require("../models/products.model");
const prisma = require("../models/index");

async function getAllProduct(req, res, next) {
  var perPage = req.query?.limit || 10;
  var page = req.query?.page || 1;
  prisma.product
    .findMany({
      take: perPage,
      skip: perPage * (page - 1),
      include: {
        category: true,
      },
    })
    .then((result) => {
      prisma.product.count().then((count) => {
        res.status(200).json({
          data: result,
          total: count,
          pages: Math.ceil(count / perPage),
        });
      });
    });
}

async function getProductById(req, res, next) {
  var id = req.query?.id;
  prisma.product
    .findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
      },
    })
    .then((result) => {
      res.status(200).json(result);
    });
}

async function searchProduct(req, res, next) {
  let query = req.query?.q;
  prisma.product
    .findMany({
      where: {
        name: {
          contains: query,
        },
      },
    })
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(400).send(err));
}

async function postOneProduct(req, res, next) {
  prisma.product
    .create({ data: req.body })
    .then((result) => {
      res.status(200).send({ message: "Create product success" });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
}

function getRelatedProduct(req, res, next) {
  let limit = req.query?.limit ? parseInt(req.query?.limit) : 4;
  let { category, price } = req.body;
  prisma.product
    .findMany({
      take: limit,
      where: {
        AND: [
          {
            category: {
              name: category,
            },
          },
          {
            OR: [
              {
                price: {
                  gte: price,
                },
              },
              {
                price: {
                  lte: price,
                },
              },
            ],
          },
        ],
      },
      include: {
        category: true,
      },
    })
    .then((result) => res.status(200).send(result))
    .catch((err) => {
      console.log('err', err)
      res.status(400).send(err)
    });
}

module.exports = {
  getAllProduct,
  getProductById,
  searchProduct,
  postOneProduct,
  postOneProduct,
  getRelatedProduct,
};
