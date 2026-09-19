import { getLocalStorage, loadHeaderFooter, setLocalStorage } from "./utils.mjs";


loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  const noItems = document.getElementById("no-items");
  if (cartItems.length != 0) {
    noItems.hidden = true;
  } else {
    noItems.hidden = false;
  }
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}



function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__remove" data-id="${item.ID}">X</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();

const productList = document.querySelector(".product-list");

productList.addEventListener("click", (event) => {
  if (!event.target.classList.contains("cart-card__remove")) {
    return;
  }

  let productID = event.target.dataset.id;
  let cartItems = getLocalStorage("so-cart") || [];
  let index = cartItems.indexOf(productID);

  cartItems.splice(index, 1);

  setLocalStorage("so-cart", cartItems);

  renderCartContents();
});