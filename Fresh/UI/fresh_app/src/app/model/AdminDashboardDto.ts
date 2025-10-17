import { MonthlyPurchaseDto } from "./MonthlyPurchaseDto";
import { PaymentType } from "./PaymentType";
import { PaymentTypeDto } from "./PaymentTypeDto";
import { PurchasedProductsDto } from "./PurchasedProductsDto";
import { TopClientsDto } from "./TopClientsDto";

export interface AdminDashboardDto {
    totalProducts: number;
    totalClients: number;
    totalPurchases: number;
    totalPaid: number;
    totalDebt:number;

    purchasedProducts: PurchasedProductsDto[];
    monthlyPurchase: MonthlyPurchaseDto[];
    topClients: TopClientsDto[];
    paymentType: PaymentTypeDto[];
}