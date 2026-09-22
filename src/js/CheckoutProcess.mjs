import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};

    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });

    return convertedJSON;

}

function packageItems(items) {
    const simplifiedItems = items.map(item => {
        console.log(item);
        return {
            id: item.ID,
            price: item.FinalPrice,
            name: item.Name,
            quantity: 1,
        }
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
        console.log("loaded");
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
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
        order.orderTotal = this.orderTotal;
        order.tax = this.tax;
        order.shipping = this.shipping;
        order.items = packageItems(this.list);

        try {
            const response = await services.checkout(order);
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    }

}