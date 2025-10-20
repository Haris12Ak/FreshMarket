import { Products } from "./Products";

export class ProductPrice {
    id: number;
    pricePerUnit: number;
    effectiveFrom: Date;
    productId: number;

    products: Products;

    constructor(id: number, pricePerUnit: number, effectiveFrom: Date, productId: number, products: Products) {
        this.id = id;
        this.pricePerUnit = pricePerUnit;
        this.effectiveFrom = effectiveFrom;
        this.productId = productId;
        this.products = products;
    }
}