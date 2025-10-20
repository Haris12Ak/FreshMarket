import { ProductType } from "./ProductType";
import { UnitType } from "./UnitType";

export class Products {
    id: number;
    name: string;
    image?: string;
    unit: UnitType;
    isActive: boolean;
    companyId: number;
    productTypeId: number;
    currentPricePerUnit?: number;

    productType: ProductType;

    constructor(id: number, name: string, image: string | undefined, unit: UnitType, isActive: boolean, companyId: number, productTypeId: number, currentPricePerUnit: number | undefined, productType: ProductType) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.unit = unit;
        this.isActive = isActive;
        this.companyId = companyId;
        this.productTypeId = productTypeId;
        this.currentPricePerUnit = currentPricePerUnit
        this.productType = productType;
    }

    static fromJson(json: any): Products {
        return new Products(
            json.id,
            json.name,
            json.image ?? '',
            json.unit,
            json.isActive,
            json.companyId,
            json.productTypeId,
            json.currentPricePerUnit ?? '',
            json.productType,
        );
    }
}