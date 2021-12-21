const { getAllProducts, Product } = require("../models/products.model");
const prisma = require("../models/index");

async function getAllProduct(req, res, next) {
  var perPage = parseInt(req.query?.limit) || 10;
  var page = parseInt(req.query?.page) || 1;
  var filter = req.query.filter ? JSON.parse(req.query.filter) : {}
  var maxPrice = parseInt(filter.maxPrice) || undefined;
  var minPrice = parseInt(filter.minPrice) || undefined;
  var slug = req.query?.slug || undefined;
  var ratingFilter = filter?.rating ? filter.rating.map(item => parseInt(item)) : undefined

  prisma.product
    .findMany({
      take: perPage,
      skip: perPage * (page - 1),
      include: {
        category: true,
      },
      where: {
        category: {
          slug: slug,
        },
        AND: [
          {
            price: {
              lte: maxPrice,
            },
          },
          {
            price: {
              gte: minPrice,
            },
          },
        ],
        rating: {
          in: ratingFilter
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    })
    .then((result) => {
      prisma.product.count({
        where: {
          category: {
            slug: slug,
          },
        },
      }).then((count) => {
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
  var product = {
    ...req.body,
    price: parseInt(req.body?.price),
    salePrice: req.body?.salePrice ? parseInt(req.body?.salePrice) : undefined,
    quantity: req.body?.quantity ? parseInt(req.body?.quantity) : undefined,
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
