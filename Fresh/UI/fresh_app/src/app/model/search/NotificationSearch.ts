import { BaseSearch } from "./BaseSearch";

export interface NotificationSearch extends BaseSearch {
    isCompanyIncluded?: boolean;
}