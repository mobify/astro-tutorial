var Site = require('json!../../../tests/system/site.json');

var webSelectors = {
  addToBag: '.c-product-list .c-product:nth-child(1) button',
  checkout: '.c-checkout__action button',
  productInCart: '.c-product__wrapper'
};

module.exports = {
    before: function(browser) {
        browser
          .pause(3000)
          .useCss()
          .context("WEBVIEW_com.mobify.astro.scaffold")
          .pause(2000);
    },

    'Add Product to Cart from PLP test - Webview context': function(browser) {
        browser
          .windowHandles(function(result) {
            handles = result.value;
            browser
              // Index window
              .switchWindow(handles[2])
              .waitForElementVisible(webSelectors.addToBag)
              .click(webSelectors.addToBag)

              // Cart slides out, switch to cart window
              .switchWindow(handles[1])
              .waitForElementVisible(webSelectors.checkout)
              .verify.elementsVisible(webSelectors.checkout)
              .verify.elementsVisible(webSelectors.productInCart);
           })
        .end();
    }
};