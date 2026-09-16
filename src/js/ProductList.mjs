const template = document.getElementById("product-card-template");

function populateList(list, listElement) {

    list.forEach((element) => {
        console.log(element);
        const clone = template.content.cloneNode(true);
        const [a, img, h3, h2, p] = clone.querySelectorAll("a, img, h3, h2, p");

        a.href = `product_pages/?product=${element.Id}`;
        img.src = element.Image;
        img.alt = `Image of a ${element.Name}`;
        h3.textContent = element.Brand.Name;
        h2.textContent = element.NameWithoutBrand;
        p.textContent = `$${element.FinalPrice}`;

        listElement.appendChild(clone);
        
    });
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    } 

    async init() {
        const list = await this.dataSource.getData();
        populateList(list, this.listElement);
    }
}