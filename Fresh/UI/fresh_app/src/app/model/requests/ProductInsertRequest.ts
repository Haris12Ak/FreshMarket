import { UnitType } from "../UnitType";

export class ProductInsertRequest {
    name: string;
    image?: string;
    unit: UnitType;
    isActive: boolean;
    productTypeId: number;

    constructor(name: string, image: string | undefined, unit: UnitType, isActive: boolean, productTypeId: number) {
        this.name = name;
        this.image = image;
        this.unit = unit;
        this.isActive = isActive;
        this.productTypeId = productTypeId;
    }
}