import { alertMessage, 
    removeAllAlerts, 
    getLocalStorage, 
    setLocalStorage 
} from "./utils.mjs";

import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  // convert the form data to a JSON object
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}


function packageItems(items) {
    const simplifiedItems = items.map((item) => {
        // console.log(item);
        return {
            id: item.Id,
            price: item.FinalPrice,
            name: item.Name,
            quantity: 1,
        };
    });

    return simplifiedItems;
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key= key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.subtotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

      init() {
        this.list = getLocalStorage(this.key);
        if (this.list.length <= 0) {
            console.log("no items.")
        }
        else {
          this.calculateItemSummary();  
        } 
        
    }

    calculateItemSummary() {
        // calculate and display the total amount of the items in the cart, and the number of items.
        const summaryElement = document.querySelector(
        this.outputSelector + " #cartTotal"
        );
        const itemNumElement = document.querySelector(
        this.outputSelector + " #num-items"
        );
        itemNumElement.innerText = this.list.length;
        // calculate the total of all the items in the cart
        const amounts = this.list.map((item) => item.FinalPrice);
        this.subtotal = amounts.reduce((sum, item) => sum + item);
        summaryElement.innerText = `$${this.subtotal.toFixed(2)}`;

        this.calculateOrderTotal();
    }

    calculateOrderTotal() {
        this.tax = (this.subtotal * .06);
        this.shipping = 10 + (this.list.length - 1) * 2;
        this.orderTotal = (
            parseFloat(this.subtotal) +
            parseFloat(this.tax) +
            parseFloat(this.shipping)
        )

        this.displayOrderTotal();
    }

    displayOrderTotal() {
        const subtotal = document.querySelector(`${this.outputSelector} #cartTotal`)
        const tax = document.querySelector(`${this.outputSelector} #tax`)
        const shipping = document.querySelector(`${this.outputSelector} #shipping`)
        const total = document.querySelector(`${this.outputSelector} #orderTotal`)

        subtotal.innerText = `$${this.subtotal.toFixed(2)}`
        tax.innerText = `$${this.tax.toFixed(2)}`
        shipping.innerText = `$${this.shipping.toFixed(2)}`
        total.innerText = `$${this.orderTotal.toFixed(2)}`
    }

    async checkout() {
        const formElement = document.forms["checkout"];
        const order = formDataToJSON(formElement);

        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal.toFixed(2);
        order.tax = this.tax.toFixed(2);
        order.shipping = this.shipping;
        order.items = packageItems(this.list);

        try {
            await services.checkout(order);
            setLocalStorage(this.key, []);
            window.location.assign("/checkout/success.html");
        } catch(error) {
            removeAllAlerts();
            const messages = error.message && typeof error.message === "object"
                ? Object.values(error.message)
                : [error.message || "Unable to place your order."];
            messages.forEach((message) => alertMessage(message));
        }
    }

}