export class Payment {
    id: number;
    amount: number;
    paymentDate: Date;
    isFinalPayment: boolean;
    purchaseId: number;

    constructor(id: number,
        amount: number,
        paymentDate: Date,
        isFinalPayment: boolean,
        purchaseId: number) {
        this.id = id;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.isFinalPayment = isFinalPayment;
        this.purchaseId = purchaseId;
    }
}