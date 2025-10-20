import { PagedResult } from "./PagedResult";
import { Purchase } from "./Purchase";
import { PurchaseSearch } from "./search/PurchaseSearch";

export class ClientPurchasesInfo {
    clientId: number;
    totalPurchases: number;
    totalQuantity: number;
    totalEarnings: number;
    mostSoldProduct: string;
    lastPurchaseDate: Date;
    totalPaid: number;
    totalDebt: number;

    purchases: Purchase[] = [];
    pagedPurchases?: PagedResult<Purchase>;

    searchPurchases: PurchaseSearch = {
        page: undefined,
        pageSize: undefined,
        productType: undefined,
        dateFrom: undefined,
        dateTo: undefined
    }

    constructor(
        clientId: number,
        totalPurchases: number,
        totalQuantity: number,
        totalEarnings: number,
        mostSoldProduct: string,
        lastPurchaseDate: Date,
        totalPaid: number,
        totalDebt: number,
        purchases: Purchase[] = []
    ) {
        this.clientId = clientId;
        this.totalPurchases = totalPurchases;
        this.totalQuantity = totalQuantity;
        this.totalEarnings = totalEarnings;
        this.mostSoldProduct = mostSoldProduct;
        this.lastPurchaseDate = lastPurchaseDate;
        this.totalPaid = totalPaid;
        this.totalDebt = totalDebt;
        this.purchases = purchases;
    }
}