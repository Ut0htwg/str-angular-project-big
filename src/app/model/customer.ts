import { Address } from "./address";

export class Customer {
    id = 0;
    firstName = '';
    lastName = '';
    email = '';
    address: Address = new Address();
    active = false;
}