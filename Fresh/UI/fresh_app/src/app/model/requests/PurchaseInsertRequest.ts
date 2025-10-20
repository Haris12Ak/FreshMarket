import { PaymentType } from "../PaymentType";

export class PurchaseInsertRequest {
    quantity: number;
    clientId: number;
    productId: number;
    paymentType: PaymentType;
    numberOfInstallments?: number;

    constructor(quantity: number,
        clientId: number,
        productId: number,
        paymentType: PaymentType,
        numberOfInstallments: number | undefined
    ) {
        this.quantity = quantity;
        this.clientId = clientId;
        this.productId = productId;
        this.paymentType = paymentType;
        this.numberOfInstallments = numberOfInstallments;
    }

}
