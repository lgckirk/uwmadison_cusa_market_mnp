import moment from "../lib/moment.js";

export default class Product {

    constructor(json) {

        this.productId = json.ProductId;
        this.productName = json.ProductName;
        this.productCondition = json.ProductCondition;
        this.productPrice = json.ProductPrice;
        this.productDescription = json.ProductDescription;
        this.productType = json.ProductType;
        this.productOwner = json.ProductOwner;
        this.dateCreated = json.DateCreated;
        this.dateExpire = json.DateExpire;
        this.productStatus = json.ProductStatus;
        this.productContact = json.ProductContact; // @todo: make model -Ryan
        this.productImages = json.ProductImages;

        this.dateCreatedRelative = moment(this.dateCreated).fromNow();
    }
}
