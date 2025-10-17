import { PaymentType } from "../model/PaymentType";

export function paymentTypeLabel(type: PaymentType): string {
    switch (type) {
        case PaymentType.Immediate:
            return "Immediate";
        case PaymentType.Monthly:
            return "Monthly";
        case PaymentType.Installments:
            return "Installments";
        default:
            return "Unknown";
    }
} 