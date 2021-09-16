const { getAllProducts, Product } = require("../models/products.model");

async function getAllProduct(req, res, next) {
  var perPage = 16;
  var page = req.query?.page || 1;
  console.log(`page`, page)
  Product.find() // find tất cả các data
    .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec((err, products) => {
      Product.countDocuments((err, count) => {
        // đếm để tính có bao nhiêu trang
        if (err) return next(err);
        res.send({
          products, // sản phẩm trên một page
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage) // tổng số các page
        }); // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
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
