export class ProductPriceInsertRequest {
    pricePerUnit: number;

    constructor(pricePerUnit: number) {
        this.pricePerUnit = pricePerUnit;
    }
}