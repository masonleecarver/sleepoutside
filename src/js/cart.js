import { getLocalStorage, loadHeaderFooter, setLocalStorage } from "./utils.mjs";

const productList = document.querySelector(".product-list");

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const totalElement = document.querySelector(".cart-total");
  const cartFooter = document.querySelector(".cart-footer");
  let total = 0;
  const noItems = document.getElementById("no-items");
  if (cartItems.length != 0) {
    noItems.hidden = true;
    cartFooter.hidden = false;
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productList.innerHTML = htmlItems.join("");
    cartItems.forEach(item => {
      total += item.FinalPrice;
    });
    totalElement.textContent = `Subtotal: ${total.toFixed(2)}`;
  } else {
    noItems.hidden = false;
    cartFooter.hidden = true;
    productList.innerHTML = "";
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__remove" data-id="${item.Id}">X</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();

productList.addEventListener("click", (event) => {
  if (!event.target.classList.contains("cart-card__remove")) {
    return;
  }

  let productID = event.target.dataset.id;
  let cartItems = getLocalStorage("so-cart") || [];
  let product = cartItems.find(item => item.Id === productID);
  let index = cartItems.indexOf(product);

  if (index !== -1) {
    cartItems.splice(index, 1);
  }

  console.log(`removed ${productID}`)

  setLocalStorage("so-cart", cartItems);

  renderCartContents();
});