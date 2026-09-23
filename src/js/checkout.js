import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init()

document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));

// listening for click on the button
document.forms.checkout.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.currentTarget.checkValidity()) {
    order.checkout();
  } else {
    event.currentTarget.reportValidity();
  }
});