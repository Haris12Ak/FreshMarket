import { PaymentType } from "../PaymentType";

export class PurchaseUpdateRequest {
    quantity: number;
    productId: number;
    paymentType?: PaymentType;

    constructor(quantity: number,
        productId: number,
        paymentType?: PaymentType
    ) {
        this.quantity = quantity;
        this.productId = productId;
        this.paymentType = paymentType;
    }

}
