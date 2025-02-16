let cart = [];
let totalPrice = 0;

fetch("https://dummyjson.com/products")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    data.products.forEach(function (product) {
      const shortDescription = product.description;

      const cardHTML = `
              <div class="col">
                  <div class="card shadow-sm h-100" style="">
                      <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}" style="">
                      <div class="card-body d-flex flex-column">
                          <h5 class="card-title">${product.title}</h5>
                          <p class="card-text flex-grow-1">${shortDescription}</p>
                          <p><strong>Price:</strong> $${product.price}</p>
                          <p><strong>Rating:</strong> ${product.rating} <i class="fa-solid fa-star"></i></p>
                        
                          <div class="mt-auto">
                              
                              <button class="btn btn-success mt-2 w-100" onclick="addToCart(${product.id}, '${product.title}', '${product.thumbnail}', ${product.price})"><i class="fa-solid fa-cart-plus"></i>Add to Cart</button>
                          </div>
                      </div>
                  </div>
              </div>
          `;

      document.querySelector(".row").insertAdjacentHTML("beforeend", cardHTML);
    });
  })
  .catch(function (error) {
    console.error("Error fetching data:", error);
  });

function viewDetails(productId) {
  console.log("View details for product with ID:", productId);
}

function addToCart(id, title, thumbnail, price) {
  const productInCart = cart.find(function (item) {
    return item.id === id;
  });

  if (productInCart) {
    productInCart.quantity++;
  } else {
    cart.push({
      id: id,
      title: title,
      thumbnail: thumbnail,
      price: price,
      quantity: 1,
    });
  }
  updateCartButton();
  updateOffcanvas();
}
function updateCartButton() {
  const cartButton = document.querySelector(".btn-cart");
  const totalItems = cart.reduce(function (acc, item) {
    return acc + item.quantity;
  }, 0);
  cartButton.innerHTML =
    '<i class="fa-solid fa-cart-shopping"></i> ' + totalItems;
}

function updateOffcanvas() {
  const offcanvasBody = document.querySelector(".offcanvas-body");
  offcanvasBody.innerHTML = "";

  cart.forEach(function (item) {
    const itemHTML = `
            <div class="cart-item d-flex align-items-center text-start w-100 p-2 bg-secondary-subtle">
                <img src="${item.thumbnail}" 
                     alt="${item.title}" 
                     style="width: 60px; height: auto; margin-right: 10px;"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/60'">
                <div class="flex-grow-1">
                    <div>${item.title} - $${item.price}</div>
                    <div class="d-flex align-items-center mt-2">
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${
                          item.id
                        }, -1)">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${
                          item.id
                        }, 1)">+</button>
                    </div>
                </div>
                <span class="fw-bold">$${(item.quantity * item.price).toFixed(
                  2
                )}</span>
                <button class="btn btn-sm btn-danger ms-2" onclick="deleteItem(${
                  item.id
                },${item.quantity})"><i class="fa-solid fa-trash"></i></button>
            </div>
            <hr>
        `;
    offcanvasBody.insertAdjacentHTML("beforeend", itemHTML);
  });

  totalPrice = cart.reduce(function (acc, item) {
    return acc + item.price * item.quantity;
  }, 0);
  const totalPriceHTML = `
        <div class="d-flex justify-content-between align-items-center mt-3">
            <div>
                <button class="btn btn-primary btn-sm" onclick="checkout()">Checkout</button>
                <button class="btn btn-secondary btn-sm ms-2" onclick="cancel()">Cancel</button>
            </div>
            <strong>Total: $${totalPrice.toFixed(2)}</strong>
        </div>
    `;
  offcanvasBody.insertAdjacentHTML("beforeend", totalPriceHTML);
}

function deleteItem(itemId, qty) {
  const isConfirmed = confirm(
    "Are you sure you want to delete this item from your cart?"
  );
  if (isConfirmed) {
    cart = cart.filter((item) => item.id !== itemId);
    updateOffcanvas();
    const cartButton = document.querySelector(".btn-cart");
    if (cartButton) {
      let currentCount = parseInt(cartButton.innerHTML.replace(/\D/g, ""));
      if (!isNaN(currentCount) && currentCount > 0) {
        currentCount -= qty;
        cartButton.innerHTML =
          '<i class="fa-solid fa-cart-shopping"></i> ' + currentCount;
        console.log(currentCount);
        if (currentCount == 0) {
          const offcanvasBody = document.querySelector(".offcanvas-body");
          offcanvasBody.innerHTML = "";
          document
            .getElementById("closeOffcanvas")
            .addEventListener("click", function () {
              offcanvas.hide();
            });
        }
      } else {
        console.error("Cart button count is invalid or empty.");
      }
    } else {
      console.error("Cart button not found!");
    }
  } else {
    console.log("Item deletion was canceled.");
  }
}

function cancel() {
  const isConfirmed = confirm("Are you sure you want to clear your cart?");
  if (isConfirmed) {
    cart = [];
    updateOffcanvas();
    const cartButton = document.querySelector(".btn-cart");
    if (cartButton) {
      cartButton.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> 0';
    } else {
      console.error("Cart button not found!");
    }
    const offcanvasBody = document.querySelector(".offcanvas-body");
    if (offcanvasBody) {
      offcanvasBody.innerHTML = "";
      document
        .getElementById("closeOffcanvas")
        .addEventListener("click", function () {
          offcanvas.hide();
        });
    } else {
      console.error("Offcanvas body not found!");
    }
    const offcanvas = document.querySelector(".offcanvas");
    if (offcanvas) {
      const offcanvasInstance = new bootstrap.Offcanvas(offcanvas);
      offcanvasInstance.hide();
    }
  } else {
    console.log("Action canceled by user.");
  }
}

function updateQuantity(id, delta) {
  const productInCart = cart.find(function (item) {
    return item.id === id;
  });

  if (productInCart) {
    productInCart.quantity += delta;
    if (productInCart.quantity < 1) {
      productInCart.quantity = 1;
    }
  }

  updateCartButton();
  updateOffcanvas();
}
