const DB = require("./db.js");
const { PrismaClient } = require("@prisma/client");
class shopping_cart {
  #db = new DB();
  #prisma;
  constructor() {
    this.#prisma = new PrismaClient();
  }
  async createCart(user_id) {
    const newCart = await this.#prisma.Cart.create({
      data: {
        user: {
          connect: {
            user_id: user_id,
          },
        },
      },
    });
    return newCart;
  }

  async clearCart(cart_id) {
    const clearedCart = await this.#prisma.cart.update({
      where: {
        cart_id: cart_id,
      },
      data: {
        products: {
          disconnect: true,
        },
      },
    });

    return clearedCart;
  }

  async addToCart(cart_id, product_id, quantity = 1) {
    try {
      // Pobierz aktualny koszyk
      const cart = await this.#prisma.cart.findUnique({
        where: {
          cart_id: cart_id,
        },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // Sprawdź, czy produkt już istnieje w koszyku
      const existingCartItem = cart.cartItems.find(
        (item) => item.product.product_id === product_id
      );

      if (existingCartItem) {
        // Jeśli produkt istnieje w koszyku, zaktualizuj jego ilość
        const updatedCart = await this.#prisma.cartToItem.update({
          where: {
            cart_item_id: existingCartItem.cart_item_id,
          },
          data: {
            quantity: existingCartItem.quantity + quantity,
          },
        });

        return updatedCart;
      } else {
        // Jeśli produkt nie istnieje w koszyku, dodaj nowy wpis
        const updatedCart = await this.#prisma.cart.update({
          where: {
            cart_id: cart_id,
          },
          data: {
            cartItems: {
              create: {
                quantity: quantity,
                product: {
                  connect: {
                    product_id: product_id,
                  },
                },
              },
            },
          },
          include: {
            cartItems: true,
          },
        });

        return updatedCart;
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas dodawania do koszyka:", error);
      throw new Error("Wystąpił błąd podczas dodawania do koszyka.");
    }
  }

  async deleteFromCart(cart_id, product_id) {
    const updatedCart = await this.#prisma.Cart.update({
      where: {
        cart_id: cart_id,
      },
      data: {
        products: {
          disconnect: {
            product_id: product_id,
          },
        },
      },
    });

    return updatedCart;
  }
  async getCartFromUserID(user_id) {
    const cart = await this.#prisma.Cart.findUnique({
      where: {
        user_id: user_id,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return cart;
  }

  async getCart(Cart_id) {
    const cart = await this.#prisma.Cart.findUnique({
      where: {
        cart_id: Cart_id,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return cart;
  }
}
module.exports = shopping_cart;
