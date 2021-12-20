const { getAllProducts, Product } = require("../models/products.model");
const prisma = require("../models/index");

async function getAllProduct(req, res, next) {
  var result = null
  try {
    if (req.query.id) {
      result = await prisma.product.findUnique({
        where: {
          id: req.query.id
        }
      })
    } else result = await prisma.product.findMany()
  } catch (error) {
    next(error)
    return null
  }
  res.status(200).json({
    status: 200,
    data: result
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
  var product = {
    ...req.body,
    price: parseInt(req.body?.price),
    salePrice: parseInt(req.body?.salePrice || undefined),
    quantity: parseInt(req.body?.quantity),
  }
  prisma.product
    .create({ data: product })
    .then((result) => {
      res.status(200).send({ message: "Create product success" });
    })
    .catch((err) => {
      console.log(`err`, err)
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
      console.log("err", err);
      res.status(400).send(err);
    });
}

function getTotalCount(req, res, next) {
  prisma.product.count().then((count) => {
    res.status(200).json(count);
  })
}

function getAllBySlug(req, res, next) {
  let slug = req.query?.slug || undefined;
  var perPage = parseInt(req.query?.limit) || 10;
  var page = parseInt(req.query?.page) || 1;
  var maxPrice = parseInt(req.body?.maxPrice) || undefined;
  var minPrice = parseInt(req.body?.minPrice) || undefined;
  prisma.product
    .findMany({
      take: perPage,
      skip: perPage * (page - 1),
      where: {
        category: {
          slug: slug,
        }
      },
      include: {
        category: true,
      }
    })
    .then((result) => {
      // console.log(`result`, result)
      prisma.product.count({
        where: {
          category: {
            slug: slug,
          }
        }
      }).then((count) => {
        res.status(200).json({
          data: result,
          total: count,
          pages: Math.ceil(count / perPage),
        });
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

module.exports = {
  getAllProduct,
  getProductById,
  searchProduct,
  postOneProduct,
  postOneProduct,
  getRelatedProduct,
  getTotalCount,
  getAllBySlug,
};
