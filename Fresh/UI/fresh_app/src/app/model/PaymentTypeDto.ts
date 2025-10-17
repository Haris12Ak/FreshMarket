import { PaymentType } from "./PaymentType";

export interface PaymentTypeDto {
    paymentType: PaymentType;
    totalAmount: number;
    count: number;
}