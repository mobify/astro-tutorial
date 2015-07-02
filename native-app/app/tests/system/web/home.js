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
          // Get all windows inside this webview. 
          .windowHandles(function (result) {
            browser
            // There are multiple windows within the webview.
            // We want to switch to the one containing the main PLP page.
            // The others are Account and Cart pages, etc. 
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
