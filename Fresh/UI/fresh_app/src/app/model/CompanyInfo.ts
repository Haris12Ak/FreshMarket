export class CompanyInfo {
    companyId: number;
    companyName: string;
    companyAddress: string;

    constructor(companyId: number, companyName: string, companyAddress: string) {
        this.companyId = companyId;
        this.companyName = companyName;
        this.companyAddress = companyAddress;
    }
}