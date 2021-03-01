import { Address } from "./address";

export class Customer {
    id: number = 0;
    firstName: string = "";
    lastName: string = "";
    email: string = "";
    address: Address = undefined;
    active: boolean = true;

    constructor(properties?: Customer) {
        if (properties) {
            this.id = properties.id || 0;
            this.firstName = properties.firstName || "";
            this.lastName = properties.lastName || "";
            this.email = properties.email || "";
            this.address = properties.address || undefined;
            this.active = properties.active || true;
        }
    }
}
