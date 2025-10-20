import { CompanyInfo } from "./CompanyInfo";

export class Notification {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    companyId: number;

    company: CompanyInfo;

    constructor(id: number,
        title: string,
        content: string,
        createdAt: Date,
        companyId: number,
        company: CompanyInfo) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.companyId = companyId;
        this.company = company;
    }

    static fromJson(json: any): Notification {
        return new Notification(
            json.id,
            json.title,
            json.content,
            json.createdAt,
            json.companyId,
            json.company
        );
    }
}