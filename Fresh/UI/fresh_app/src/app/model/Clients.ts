import { Purchase } from "./Purchase";

export class Clients {
    id: number;
    keycloakId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string = '';
    createdAt: Date;

    purchases: Purchase[] = [];

    constructor(id: number, keycloakId: string, username: string, email: string, firstName: string, lastName: string, phone: string = '', createdAt: Date, purchases: Purchase[]) {
        this.id = id;
        this.keycloakId = keycloakId;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.createdAt = createdAt;
        this.purchases = purchases;
    }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    static fromJson(json: any): Clients {
        return new Clients(
            json.id,
            json.keycloakId,
            json.username,
            json.email,
            json.firstName,
            json.lastName,
            json.phone ?? '',
            new Date(json.createdAt),
            json.purchases ?? []
        );
    }
}