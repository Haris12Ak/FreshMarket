import { BaseSearch } from "./BaseSearch";

export interface ProductSearch extends BaseSearch {
    name?: string;
    productType?: string;
    isActive?: boolean | null;
    isActiveString?: string;
}