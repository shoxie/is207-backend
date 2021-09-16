const { getAllProducts, Product } = require("../models/products.model");

async function getAllProduct(req, res, next) {
  var perPage = req.query?.limit || 10;
  var page = req.query?.page || 1;
  Product.find() 
    .skip(perPage * page - perPage) 
    .limit(perPage)
    .exec((err, products) => {
      Product.countDocuments((err, count) => {
        if (err) return next(err);
        res.send({
          products, 
          current: page, 
          pages: Math.ceil(count / perPage) 
        });
      });
    });
}


async function getProductById(req, res, next) {
  var id = req.query?.id;
  Product.find({ id }).exec((err, product) => {
    if (err) return res.status(400).send(err)
    res.status(200).send(product)
  })
}

async function searchProduct(req, res, next) {
  let query = req.query?.q
  Product.find({'name': {'$regex': `${query}`, '$options': 'i'}}).exec((err, products) => {
    if (err) return res.status(400).send(err)
    res.status(200).send(products)
  })
}

module.exports = {
  getAllProduct,
  getProductById,
  searchProduct
};
