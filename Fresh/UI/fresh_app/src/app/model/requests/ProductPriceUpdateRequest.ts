export class ProductPriceUpdateRequest {
    pricePerUnit: number;
    effectiveFrom: Date;
    productId: number;

    constructor(pricePerUnit: number, effectiveFrom: Date, productId: number) {
        this.pricePerUnit = pricePerUnit;
        this.effectiveFrom = effectiveFrom;
        this.productId = productId;
    }
}