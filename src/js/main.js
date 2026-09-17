import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import "./newsletter.js";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ProductData("tents");

const listElement = document.querySelector(".product-list");

const list = new ProductList("tents", dataSource, listElement);

list.init();
