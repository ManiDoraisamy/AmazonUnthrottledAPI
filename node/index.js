var generateQueryString = require('amazon-product-api/lib/utils').generateQueryString,
    request = require('request'),
    parseXML = require('xml2js').parseString;

if (typeof Promise === 'undefined') {
  Promise = require('es6-promise').Promise;
}

var runQuery = function (credentials, method) {

  return function (query, cb) {
    var req = query.request || request;
    delete query.request;
    var istrim = query.trim;
    delete query.trim;
    if(method=='ItemSearch' || method=='ItemLookup' || method=='SimilarityLookup')
    {
      query.ResponseGroup = 'Accessories,AlternateVersions,BrowseNodes,EditorialReview,'+
      'Images,ItemAttributes,ItemIds,Large,Medium,OfferFull,OfferListings,Offers,OfferSummary,'+
      'PromotionSummary,Reviews,SalesRank,SearchBins,Similarities,Small,Tracks,'+
      'Variations,VariationMatrix,VariationOffers,VariationSummary';
    }
    else if(method=='BrowseNodeLookup')
    {
      query.ResponseGroup = 'BrowseNodeInfo,MostGifted,NewReleases,MostWishedFor,TopSellers';
    }
    var url = generateQueryString(query, method, credentials);
    url = url.replace('webservices.amazon.com','com.commercedna.com');
    console.debug('Fetching '+method+' with '+url);

    var trimArray = function(jso)
    {
      if(!istrim) return jso;
      if(Array.isArray(jso))
      {
        if(jso.length==1)
          return trimArray(jso[0]);
        else
        {
          for(var i=0; i<jso.length; i++)
            jso[i] = trimArray(jso[i]);
          return jso;
        }
      }
      else if(jso===Object(jso))
      {
        for(var nm in jso)
          jso[nm] = trimArray(jso[nm]);
        return jso;
      }
      else
        return jso;
    }

    var p = new Promise(function(resolve, reject) {
      var success = function(results) {
        if (typeof cb === 'function') {
          cb.apply(null, [null].concat(Array.prototype.slice.call(arguments)));
        }else{
          resolve(results);
        }
      };

      var failure = function(err) {
        if (typeof cb === 'function') {
          cb.call(null, err);
        } else {
          reject(err);
        }
      };


      req(url, function (err, response, body) {
        if (err) {
          failure(err);
        } else if (!response) {
          failure("No response (check internet connection)");
        } else if (response.statusCode !== 200) {
          parseXML(body, function (err, resp) {
            if (err) {
              failure(err);
            } else {
              failure(trimArray(resp[method + 'ErrorResponse']));
            }
          });
        } else {
          parseXML(body, function (err, resp) {
            if (err) {
              failure(err);
            } else {
              var respObj = resp[method + 'Response'];
              if (respObj.Items && respObj.Items.length > 0) {
                // Request Error
                if (respObj.Items[0].Request && respObj.Items[0].Request.length > 0 && respObj.Items[0].Request[0].Errors) {
                  failure(respObj.Items[0].Request[0].Errors);
                } else if (respObj.Items[0].Item) {
                  success(
                    trimArray(respObj.Items[0].Item),
                    trimArray(respObj.Items)
                  );
                }
              } else if (respObj.BrowseNodes && respObj.BrowseNodes.length > 0) {
                // Request Error
                if (respObj.BrowseNodes[0].Request && respObj.BrowseNodes[0].Request.length > 0 && respObj.BrowseNodes[0].Request[0].Errors) {
                  failure(respObj.BrowseNodes[0].Request[0].Errors);
                } else if (respObj.BrowseNodes[0].BrowseNode) {
                  success(
                    trimArray(respObj.BrowseNodes[0].BrowseNode),
                    trimArray(respObj.BrowseNodes)
                  );
                }
              }
            }
          });
        }
      });
    });

    if(typeof cb !== 'function') {
      return p;
    }
  };
};

var createClient = function (credentials) {
  return {
    itemSearch: runQuery(credentials, 'ItemSearch'),
    itemLookup: runQuery(credentials, 'ItemLookup'),
    browseNodeLookup: runQuery(credentials, 'BrowseNodeLookup'),
    similarityLookup: runQuery(credentials, 'SimilarityLookup')
  };
};

exports.createClient = createClient;
