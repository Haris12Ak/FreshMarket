export class ProductType {
    id: number;
    name: string;
    descriptions?: string;

    constructor(id: number, name: string, descriptions: string | undefined) {
        this.id = id;
        this.name = name;
        this.descriptions = descriptions;
    }
}