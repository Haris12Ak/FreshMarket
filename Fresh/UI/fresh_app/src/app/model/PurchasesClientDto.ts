import { PagedResult } from "./PagedResult";
import { Purchase } from "./Purchase";
import { PurchaseSearch } from "./search/PurchaseSearch";

export class PurchasesClientDto {
    clientId: number;
    clientFirstLastName: string;
    clientPhone?: string;
    clientEmail: string;
    totalPurchases: number;
    totalQuantity: number;
    totalEarnings: number;
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

    constructor(clientId: number,
        clientFirstLastName: string,
        clientPhone: string | undefined,
        clientEmail: string,
        totalPurchases: number,
        totalQuantity: number,
        totalEarnings: number,
        totalPaid: number,
        totalDebt: number,
        purchases: Purchase[] = [],
        pagedPurchases?: PagedResult<Purchase>) {
        this.clientId = clientId;
        this.clientFirstLastName = clientFirstLastName;
        this.clientPhone = clientPhone;
        this.clientEmail = clientEmail;
        this.totalPurchases = totalPurchases;
        this.totalQuantity = totalQuantity;
        this.totalEarnings = totalEarnings;
        this.totalPaid = totalPaid;
        this.totalDebt = totalDebt;
        this.purchases = purchases;
        this.pagedPurchases = pagedPurchases;
    }
}