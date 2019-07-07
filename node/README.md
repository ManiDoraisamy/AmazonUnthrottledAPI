# Node.js client to get unthrottled access to Amazon Product Advertising API

![alt text](http://i.imgur.com/MwfPRfB.gif "Amazon Product Advertising API")

Node.js client for [Amazon Product Advertising API](https://affiliate-program.amazon.com/gp/advertising/api/detail/main.html). This is a drop-in replacement for [amazon-product-api Node.js client](https://www.npmjs.com/package/amazon-product-api), if you are already using it.


[![NPM](https://nodei.co/npm/amazon-unthrottled-api.png?downloads=true)](https://nodei.co/npm/amazon-unthrottled-api/)


## Installation
Install using npm:
```sh
npm install amazon-unthrottled-api
```


## Usage

Require library
```javascript
var amazon = require('amazon-unthrottled-api');
```

Create client
```javascript
var client = amazon.createClient({
  awsId: "aws ID",
  awsSecret: "aws Secret",
  awsTag: "aws Tag"
});
```
Now you are ready to use the API!


### ItemSearch

> The ItemSearch operation searches for items on Amazon. The Product Advertising API returns up to ten items per search results page.

[📖 Documentation](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemSearch.html)

Using promises:
```javascript
client.itemSearch({
  keywords: 'Quentin Tarantino',
  searchIndex: 'DVD'
}).then(function(results){
  console.log(results);
}).catch(function(err){
  console.log(err);
});
```

#### Query params:

You can add these [params](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemSearch.html) for the *itemSearch* method:

- [keywords:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemSearch.html) Defaults to ''.

- [searchIndex:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/USSearchIndexParamForItemsearch.html) Defaults to 'All'.

- [itemPage:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemSearch.html) Defaults to '1'.



### ItemLookup

> Given an Item identifier, the ItemLookup operation returns some or all of the item attributes, depending on the response group specified in the request.

[📖 Documentation](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)

Using promises:
```javascript
client.itemLookup({
  idType: 'UPC',
  itemId: '884392579524'
}).then(function(results) {
  console.log(JSON.stringify(results));
}).catch(function(err) {
  console.log(err);
});
```


#### Query params:

You can add any [available params](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html) for the *ItemLookup* method.

- [idType:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html) Type of item identifier used to look up an item. Availiable options - 'ASIN', 'UPC', 'EAN'. Defaults to 'ASIN'.

- [itemId:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html) One or more (up to ten) positive integers that uniquely identify an item.

- [searchIndex:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/USSearchIndexParamForItemsearch.html) Defaults to 'All'.



### BrowseNodeLookup

> Given a browse node ID, BrowseNodeLookup returns the specified browse node’s name, children, and ancestors. The names and browse node IDs of the children and ancestor browse nodes are also returned. BrowseNodeLookup enables you to traverse the browse node hierarchy to find a browse node.

[📖 Documentation](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/BrowseNodeLookup.html)

Using promises:
```javascript
client.browseNodeLookup({
  browseNodeId: '549726',
  responseGroup: 'NewReleases'
}).then(function(results) {
  console.log(results);
}).catch(function(err) {
  console.log(err);
});
```


#### Query params:

You can add any [available params](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/BrowseNodeLookup.html) for the *BrowseNodeLookup* method.

- [browseNodeId:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/BrowseNodeLookup.html) A positive integer assigned by Amazon that uniquely identifies a product category.

- [responseGroup:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CHAP_ResponseGroupsList.html) You can use multiple values by separating them with comma (e.g responseGroup: 'MostGifted,NewReleases,MostWishedFor,TopSellers'). Defaults to 'BrowseNodeInfo'.

