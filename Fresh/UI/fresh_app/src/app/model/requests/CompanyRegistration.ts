export class CompanyRegistration {
    companyName: string;
    companyAddress: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string = '';
    password: string;
    confirmPassword: string;

    constructor(companyName: string, companyAddress: string, username: string, email: string, firstName: string, lastName: string, phone: string = '', password: string, confirmPassword: string) {
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }
}