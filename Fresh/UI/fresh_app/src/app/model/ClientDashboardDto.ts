import { MonthlyPurchaseDto } from "./MonthlyPurchaseDto";
import { PurchasedProductsDto } from "./PurchasedProductsDto";
import { TopProductsDto } from "./TopProductsDto";

export interface ClientDashboardDto {
    totalPurchases: number;
    totalEarnings: number;
    totalPaid: number;
    totalDebt: number;

    purchasedProducts: PurchasedProductsDto[];
    monthlyPurchase: MonthlyPurchaseDto[];
    topProducts: TopProductsDto[];
}