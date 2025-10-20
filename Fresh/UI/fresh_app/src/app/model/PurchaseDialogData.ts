import { Clients } from "./Clients";
import { Purchase } from "./Purchase";
import { PurchasesClientDto } from "./PurchasesClientDto";

export interface PurchaseDialogData {
    mode: string;
    client: PurchasesClientDto;
    companyId: number;
    purchase: Purchase;
}