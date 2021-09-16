const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  sku: {
    type: String,
    required: true,
  },
  freshNess: {
    type: String,
    enum: ["fresh", "expired"],
  },
  farm: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    required: true,
    enum: ["inStock", "outOfStock"],
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
});

var Product = mongoose.model("Products", productsSchema);

const createOneProduct = (product) => new Product(product).save();

const getOneProduct = (id) => Product.findById(id);

const reduceQuantity = (id) =>
  Product.findByIdAndUpdate(id, { $inc: { quantity: -1 } });

const increaseQuantity = (id) =>
  Product.findByIdAndUpdate(id, { $inc: { quantity: 1 } });

const getAllProducts = async (perPage, page) => {
  var data = await  Product.find() // find tất cả các data
    .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec((err, products) => {
      Product.countDocuments((err, count) => {
        // đếm để tính có bao nhiêu trang
        if (err) return err;
        return products; // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
      });
    });
  console.log(data);
  return data
};

module.exports = {
  createOneProduct,
  getOneProduct,
  reduceQuantity,
  increaseQuantity,
  getAllProducts,
  Product
};
