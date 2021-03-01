export class Product {
    [propname: string]: any;
    id: number = 0; 
    name: string = '';
    type: string = '';
    catID: number = 0;
    description: string = '';
    price: number = 0;
    featured: boolean = false;
    active: boolean = true;

    constructor(properties?: Product) {
        if (properties) {
            this.id = properties.id || 0;
            this.name = properties.name || '';
            this.type = properties.type || '';
            this.catID = properties.catID || 0;
            this.description = properties.description || '';
            this.price = properties.price || 0;
            this.featured = properties.featured || false;
            this.active = properties.active || true;
        }
    }
}
