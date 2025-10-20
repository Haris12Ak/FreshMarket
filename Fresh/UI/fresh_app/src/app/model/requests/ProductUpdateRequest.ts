import { UnitType } from "../UnitType";

export class ProductUpdateRequest {
    name: string;
    image?: number;
    unit: UnitType;
    isActive: boolean;
    productTypeId: number;

    constructor(name: string, image: number | undefined, unit: UnitType, isActive: boolean, productTypeId: number) {
        this.name = name;
        this.image = image;
        this.unit = unit;
        this.isActive = isActive;
        this.productTypeId = productTypeId;
    }
}