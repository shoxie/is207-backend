const prisma = require("../models/index");

async function createOrder(req, res, next) {
  // const data = {
  //   order: [
  //     {
  //       id: "614bd0a5001d71900075593e",
  //       quantity: 1,
  //     },
  //     {
  //       id: "614bd0cd0066827b002d9d32",
  //       quantity: 3,
  //     },
  //   ],
  //   userId: "614ae171008d17bc002c85f7",
  //   shippingMethodId: "6178de2c0d2716391f93b839"
  // };
  var data = req.body;
  console.log(`data`, data);
  let products = await prisma.product.findMany({
    where: {
      id: {
        in: data.order.map((item) => item.id),
      },
    },
  });
  let shippingMethod = await prisma.shippingMethod.findUnique({
    where: {
      id: data.shippingMethodId,
    },
  });
  prisma.order
    .create({
      data: {
        ...data.userDetail,
        userId: data.userId,
        shippingMethodId: data.shippingMethodId,
        orderDetail: {
          create: data.order.map((item) => {
            return {
              productId: item.id,
              quantity: item.quantity,
              price: products.find((o) => o.id === item.id).price,
            };
          }),
        },
        total:
          data.order.reduce((acc, item) => {
            return (
              acc + products.find((o) => o.id === item.id).price * item.quantity
            );
          }, 0) + shippingMethod.price,
      },
      include: {
        orderDetail: {
          include: {
            product: true,
          },
        },
      },
    })
    .then((result) => res.send({ message: "Create order success" }))
    .catch((err) => {
      console.log(`err`, err);

      res.status(400).send(err);
    });
}

async function getShippingMethods(req, res, next) {
  prisma.shippingMethod
    .findMany()
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(400).send(err));
}

async function getUserOrders(req, res, next) {
  prisma.order.findMany({
    where: {
      userId: req.query.id,
    },
    include: {
      orderDetail: {
        include: {
          product: true,
        },
      }
      },
  }).then((result) => {
    res.status(200).send(result)
    
  }).catch((err) => {
    console.log(`err`, err)
    res.status(400).send(err)
  });
}

module.exports = {
  createOrder,
  getShippingMethods,
  getUserOrders
};
