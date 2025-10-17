export class ProductTypeUpdateRequest {
    name: string;
    descriptions?: string;

    constructor(name: string, descriptions: string | undefined) {
        this.name = name;
        this.descriptions = descriptions;
    }
}