var nativeSelectors = {
  firstProduct: "//android.support.v4.widget.DrawerLayout[1]/android.widget.LinearLayout[1]/android.widget.LinearLayout[2]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.view.View[1]/android.view.View[1]",
  addToBag: "//android.support.v4.widget.DrawerLayout[1]/android.widget.LinearLayout[1]/android.widget.LinearLayout[2]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.view.View[1]/android.widget.Button[1]",
  checkout: "//android.support.v4.widget.DrawerLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.view.View[1]/android.widget.Button[3]",

  leftIcon: "//android.widget.ImageButton[1]",
  logo: "//android.widget.ImageButton[2]",
  cartIcon: "//android.widget.ImageButton[3]",
  cartDrawer: "//android.support.v4.widget.DrawerLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]",
};

module.exports = {
    setUp: function(browser) {
        browser
          // you can .useXpath() or .useCss()
          // .useCss() will only make sense in a webview context 
          .useXpath()
    },

    'Verify native context exists': function(browser) {
        browser
          .context("NATIVE_APP", function(result) {
            this.assert.equal(result.status, 0);
          })
    },

    'Verify native components exist': function(browser) {
        browser
          .waitForElementVisible(nativeSelectors.leftIcon)
          .verify.elementsVisible(
            nativeSelectors.leftIcon,
            nativeSelectors.logo,
            nativeSelectors.cartIcon
          )
        .end();
    },

    'Cart drawer slides out - Native context': function(browser) {
      browser
        .waitForElementVisible(nativeSelectors.cartIcon)
        .click(nativeSelectors.cartIcon)
        .waitForElementVisible(nativeSelectors.cartDrawer)
        .verify.elementsVisible(
          nativeSelectors.cartDrawer
          )
      .end();
    },
};