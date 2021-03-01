export class Order {
    id: number = 0; 
    customerID: number = 0;
    productID: number = 0;
    amount: number = 0;
    status: string = 'new' || 'shipped' || 'paid';

    constructor(properties?: Order) {
        if (properties) {
            this.id = properties.id || 0;
            this.customerID = properties.customerID || 0;
            this.productID = properties.productID || 0;
            this.amount = properties.amount || 0;
            this.status = properties.status || 'new' || 'shipped' || 'paid';
        }
    }
}
