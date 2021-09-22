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
  // Product.find()
  //   .skip(perPage * page - perPage)
  //   .limit(perPage)
  //   .exec((err, products) => {
  //     Product.countDocuments((err, count) => {
  //       if (err) return next(err);
  //       res.send({
  //         products,
  //         current: page,
  //         pages: Math.ceil(count / perPage),
  //       });
  //     });
  //   });
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
  // Product.findById(id)
  //   .populate("category")
  //   .exec((err, product) => {
  //     if (err) return res.status(400).send(err);
  //     res.status(200).send(product);
  //   });
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
  // Product.find({ name: { $regex: `${query}`, $options: "i" } }).exec(
  //   (err, products) => {
  //     if (err) return res.status(400).send(err);
  //     res.status(200).send(products);
  //   }
  // );
}

async function postOneProduct(req, res, next) {
  let product = new Product(req.body);
  console.log(`product`, req.body);
  // product
  //   .save()
  //   .then((result) =>
  //     res.status(200).send({ message: "Create product success" })
  //   )
  //   .catch((err) => res.status(400).send({ message: err.message }));
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
  //function that related products based on name and category
  let { category } = req.body;
  prisma.product.findMany({
    where: {
      category: {
        name: category,
      },
    },
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
