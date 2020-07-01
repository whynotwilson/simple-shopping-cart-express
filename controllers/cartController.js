const db = require('../models');
const { company } = require('faker');
const Cart = db.Cart
const CartItem = db.CartItem
const PAGE_LIMIT = 10;
const PAGE_OFFSET = 0;

let cartController = {
  getCart: (req, res) => {

    return Cart.findByPk(req.session.cartId, { include: 'items' }).then(cart => {
      cart = cart || { items: [] }

      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', {
        cart: cart.toJSON(),
        totalPrice
      })
    })
  },

  postCart: async (req, res) => {

    const [cart, created] = await Cart.findOrCreate({
      where: {
        id: req.session.cartId || 0
      }
    })

    const [cartItem, createdCartItem] = await CartItem.findOrCreate({
      where: {
        CartId: cart.id,
        ProductId: req.body.productId
      },
      default: {
        CartId: cart.id,
        ProductId: req.body.productId,
      }
    })

    if (cartItem) {
      await cartItem.update({
        quantity: (cartItem.quantity || 0) + 1
      })
    }

    req.session.cartId = cart.id
    return req.session.save(() => {
      return res.redirect('back')
    })
  },

}

module.exports = cartController
