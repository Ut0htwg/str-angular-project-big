import { Address } from "./address";

export class Customer {
    [propname: string]: any;
    id: number = 0;
    firstName: string = "";
    lastName: string = "";
    email: string = "";
    address: Address = new Address();
    active: boolean = true;

    constructor(properties?: Customer) {
        if (properties) {
            this.id = properties.id || 0;
            this.firstName = properties.firstName || "";
            this.lastName = properties.lastName || "";
            this.email = properties.email || "";
            this.address = properties.address || new Address();
            this.active = properties.active || true;
        }
    }
}
