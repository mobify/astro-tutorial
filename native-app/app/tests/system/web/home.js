var Site = require('json!../../../tests/system/site.json');

var webSelectors = {
  productList: '.c-product-list',
  product: '.c-product:nth-child(1)'
};

module.exports = {
    setUp: function(browser) {
        browser
          .pause(3000)
          .context("WEBVIEW_com.mobify.astro.scaffold", function(result) {
            this.assert.equal(result.status, 0);
          });
    },

    'Verify webview is pointing to local site': function(browser) {
        browser
          .assert.urlContains(Site.profiles.default.siteUrl)
        .end();
    },

    'Verify webview elements': function(browser) {
        browser
          .windowHandles(function (result) {
            browser
            .switchWindow(result.value[2])
            .waitForElementVisible(webSelectors.productList)
            .verify.elementsVisible(
              webSelectors.productList,
              webSelectors.product
            );  
          })
        .end();
    }
};
