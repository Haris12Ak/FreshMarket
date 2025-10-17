import { Clients } from "./Clients";
import { Payment } from "./Payment";
import { PaymentType } from "./PaymentType";
import { Products } from "./Products";

export class Purchase {
    id: number;
    quantity: number;
    pricePerUnit: number;
    totalAmount: number;
    purchaseDate: Date;
    numberOfInstallments?: number;
    paymentType: PaymentType;
    clientId: number;
    productId: number;

    clients: Clients;
    products: Products;
    payments: Payment[] = [];

    constructor(id: number,
        quantity: number,
        pricePerUnit: number,
        totalAmount: number,
        purchaseDate: Date,
        numberOfInstallments: number | undefined,
        paymentType: PaymentType,
        clientId: number,
        productId: number,
        clients: Clients,
        products: Products,
        payments: Payment[] = []
    ) {
        this.id = id;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
        this.totalAmount = totalAmount;
        this.purchaseDate = purchaseDate;
        this.numberOfInstallments = numberOfInstallments;
        this.paymentType = paymentType;
        this.clientId = clientId;
        this.productId = productId;
        this.clients = clients;
        this.products = products;
        this.payments = payments;
    }

    get formatPrice(): string {
        return `${this.pricePerUnit} KM`;
    }

    static fromJson(json: any): Purchase {
        return new Purchase(
            json.id,
            json.quantity,
            json.pricePerUnit,
            json.totalAmount,
            json.purchaseDate,
            json.numberOfInstallments,
            json.paymentType,
            json.clientId,
            json.productId,
            json.clients,
            json.products,
            json.payments
        );
    }
}