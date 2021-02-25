export class Address {
    zip: number = 0;
    country: string = "";
    city: string = "";
    street: string = "";
    notes: string = "";

    constructor(properties?: Address) {
        if (properties) {
            this.zip = properties.zip || 0;
            this.country = properties.country || "";
            this.city = properties.city || "";
            this.street = properties.street || "";
            this.notes = properties.notes || undefined;
        }
    }
}