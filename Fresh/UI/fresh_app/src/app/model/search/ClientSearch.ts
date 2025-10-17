import { BaseSearch } from "./BaseSearch";

export interface ClientSearch extends BaseSearch {
    firstName?: string;
    lastName?: string;
}