var Site = require('json!../../../tests/system/site.json');

var webSelectors = {
  productList: '.c-product-list',
  product: '.c-product:nth-child(1)',
  pdpAddToBag: '.js-add',
  checkout: '.c-checkout__action button',
  productInCart: '.c-product__wrapper',
  productInCartActions: '.c-product__wrapper .js-toggle-actions',
  removeProductInCart: '.js-remove'
};

module.exports = {
    before: function(browser) {
        browser
          .pause(3000)
          .useCss()
          .context("WEBVIEW_com.mobify.astro.scaffold")
          .pause(2000);
    },

    'Go to PDP': function(browser) {
        browser
          .windowHandles(function(result) {
            browser
              // Index window
              .log(result.value)
              .switchWindow(result.value[2])
              .getTitle(function(title) {
                browser.log(title)
              })
              .waitForElementVisible(webSelectors.product)
              .click(webSelectors.product)
          })

    },

    'Add to cart, then remove': function(browser) {
        browser
          .pause(2000)
          .windowHandles(function(result) {
            browser
              // PDP window
              .log(result.value)
              .switchWindow(result.value[result.value.length - 1])
              .getTitle(function(title) {
                browser.log(title)
              })
              .waitForElementVisible(webSelectors.pdpAddToBag)
              .click(webSelectors.pdpAddToBag)

              // Cart slides out, switch to cart window
              .switchWindow(result.value[1])
              .getTitle(function(title) {
                browser.log(title)
              })
              .waitForElementVisible(webSelectors.checkout)
              .verify.elementsVisible(webSelectors.checkout)

              // Toggle product actions
              .waitForElementVisible(webSelectors.productInCartActions)
              .click(webSelectors.productInCartActions)
              .verify.elementPresent(webSelectors.productList + ' .c--actions-visible')

              // Remove product from cart
              .waitForElementVisible(webSelectors.removeProductInCart)
              .click(webSelectors.removeProductInCart)
              .pause(1000)
              .verify.elementNotPresent(webSelectors.productInCart);
          })
        .end();
    }
};
