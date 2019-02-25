import moment from "../lib/moment.js";
import util from "../lib/utility.js";

export default class Product {

    constructor(json) {

        this.productId = json.ProductId;
        this.productName = json.ProductName;
        this.productCondition = json.ProductCondition;
        this.productPrice = json.ProductPrice;
        this.productDescription = json.ProductDescription;
        this.productType = --json.ProductType;
        this.productOwner = json.ProductOwner;
        this.dateCreated = json.DateCreated;
        this.dateExpire = json.DateExpire;
        this.productStatus = json.ProductStatus;
        this.productContact = json.ProductContact; // @todo: make model -Ryan
        this.productImages = json.ProductImages;
        for (var i=0;i<this.productImages.length;i++)
            this.productImages[i] += "?x=" + Math.random()/9999;
        if (json.ProductDims) this.productDims = json.ProductDims[0];
        this.dateCreatedRelative = moment.utc(this.dateCreated).local().fromNow();
    }
}
