export class ClientInsertRequest {
    email: string;
    firstName: string;
    lastName: string;
    phone: string = '';

    constructor(email: string, firstName: string, lastName: string, phone: string = '') {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
    }
}