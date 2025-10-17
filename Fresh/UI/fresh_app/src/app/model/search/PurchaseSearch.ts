import { BaseSearch } from "./BaseSearch";

export interface PurchaseSearch extends BaseSearch {
    productType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    isProductIncluded? : boolean;
    isClientIncluded? : boolean;
    isPaymentsIncluded?: boolean;
}