import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key= key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.subotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSubtotal();
        this.calculateOrderTotal();
    }

    calculateItemSubtotal() {
        this.list.forEach(item => {
            this.subotal += item.FinalPrice;
        });
    }

    calculateOrderTotal() {
        this.tax = (this.subotal * .06);
        if (this.subotal >= 100) {
            this.shipping = 0;
        } else {
            this.shipping = 9.99
        }
        this.orderTotal = this.subotal + this.tax + this.shipping;

        this.displayOrderTotal();
    }

    displayOrderTotal() {
        const subtotal = document.querySelector(`${this.outputSelector} .subtotal`)
        const tax = document.querySelector(`${this.outputSelector} .tax`)
        const shipping = document.querySelector(`${this.outputSelector} .shipping`)
        const total = document.querySelector(`${this.outputSelector} .total`)

        subtotal.innerText = `$${this.subotal.toFixed(2)}`
        tax.innerText = `$${this.tax.toFixed(2)}`
        shipping.innerText = `$${this.shipping.toFixed(2)}`
        total.innerText = `$${this.orderTotal.toFixed(2)}`
    }
}