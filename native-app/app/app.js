require([
    'astro',
    'bluebird',
    'plugins/applicationPlugin',
    'plugins/webViewPlugin',
    'plugins/anchoredLayoutPlugin',
    'plugins/headerBarPlugin',
    'plugins/drawerPlugin'
],
function(
     Astro,
     Promise,
     ApplicationPlugin,
     WebViewPlugin,
     AnchoredLayoutPlugin,
     HeaderBarPlugin,
     DrawerPlugin
) {

    // Enter your site url here
    var BASE_URL = 'http://<Your IP address>:5000/';
    var CART_PATH = '/cart';
    var ACCOUNT_PATH = '/account';
    var LOGO_URL = BASE_URL + '/images/velo.png';
    var ACCOUNT_ICON_URL = BASE_URL + '/images/account.png';
    var CART_ICON_URL = BASE_URL + '/images/cart.png';
    var BACK_ICON_URL = BASE_URL + '/images/back.png';

    // Initialize plugins
    var applicationPromise = ApplicationPlugin.init();
    var mainWebViewPromise = WebViewPlugin.init();
    var layoutPromise = AnchoredLayoutPlugin.init();
    var headerPromise = HeaderBarPlugin.init();
    var drawerPromise = DrawerPlugin.init();
    var cartWebViewPromise = WebViewPlugin.init();
    var accountWebViewPromise = WebViewPlugin.init();

    // Start the app at the base url
    mainWebViewPromise.then(function(mainWebView) {
        mainWebView.navigate(BASE_URL);
    });

    accountWebViewPromise.then(function(accountWebView) {
        accountWebView.navigate(BASE_URL + 'account/');
    });

    // Use mainWebView as the main content view for our layout
    Promise.join(layoutPromise, mainWebViewPromise, function(layout, mainWebView) {
        layout.setContentView(mainWebView.address);
    });

    // Route all unhandled key presses to the mainWebView
    Promise.join(applicationPromise, mainWebViewPromise, function(application, mainWebView){
        application.setMainInputPlugin(mainWebView.address);
    });

    // Create a new promise for when icons have been loaded into the header bar
    var loadIconPromise = headerPromise.then(function(headerBar){
        return Promise.join(
            headerBar.setLeftIcon(ACCOUNT_ICON_URL),
            headerBar.setRightIcon(CART_ICON_URL),
            headerBar.setCenterIcon(LOGO_URL),
            headerBar.setBackgroundColor('#FFFFFF')
        );
    });

    // Add the header bar to the top of the layout
    Promise.join(layoutPromise, headerPromise, loadIconPromise, function(layout, headerBar) {
        layout.addTopView(headerBar.address);
        headerBar.show();
    });

    // Set the layout plugin as the main content view of the drawer
    Promise.join(drawerPromise, layoutPromise, function(drawer, layout) {
        drawer.setContentView(layout.address);
    });

    Promise.join(drawerPromise, applicationPromise, function(drawer, application) {
        application.setMainViewPlugin(drawer.address);
    });

    cartWebViewPromise.then(function(webView) {
        webView.navigate(BASE_URL + 'cart/');
    });

    var getPathFromUrl = function(url) {
        var parsedUrl = document.createElement('a');
        parsedUrl.href = url;
        return parsedUrl.pathname;
    };

    Promise.join(mainWebViewPromise, headerPromise, drawerPromise,
        function(mainWebView, header, drawer) {

            var swapLeftMenuIcon = function(path) {
                if (path !== '/') {
                    header.setLeftIcon(BACK_ICON_URL);
                    header.off('leftIconClick');
                    header.on('leftIconClick', function() {
                        mainWebView.back();
                    });
                } else {
                    header.setLeftIcon(ACCOUNT_ICON_URL);
                    header.off('leftIconClick');
                    header.on('leftIconClick', function() {
                        drawer.toggleLeftMenu();
                    });
                }
            };

            mainWebView.on('navigate' , function(params) {
                var path = getPathFromUrl(params.url);
                swapLeftMenuIcon(path);
            });

            mainWebView.on('back', function(params) {
                var path = getPathFromUrl(params.url);
                swapLeftMenuIcon(path);
            });
    });

    // Make sure the cart web view doesn't navigate anywhere but the cart
    Promise.join(cartWebViewPromise, mainWebViewPromise, drawerPromise,
        function(cartWebView, mainWebView, drawer) {
            cartWebView.disableDefaultNavigationHandler()
            cartWebView.on('navigate', function(params) {
                var url = params.url;
                var path = getPathFromUrl(url);

                if (path === CART_PATH) {
                    cartWebView.navigate(url);
                    return;
                }
                mainWebView.events.trigger('navigate', {url: url});
                drawer.hideRightMenu();
            });
    });

    // Make sure the account webview sends it's navigation to the main web view
    Promise.join(accountWebViewPromise, mainWebViewPromise, drawerPromise,
        function(accountWebView, mainWebView, drawer) {
            accountWebView.disableDefaultNavigationHandler()
            accountWebView.on('navigate', function(params) {
                var url = params.url;
                var path = getPathFromUrl(url);

                if (path === ACCOUNT_PATH) {
                    accountWebView.navigate(url);
                    return;
                }
                mainWebView.events.trigger('navigate', {url: url});
                drawer.hideLeftMenu();
            });
    });

    // Add the cart web view to the right drawer
    var rightDrawerPromise = Promise.join(cartWebViewPromise, drawerPromise, function(cartWebView, drawer) {
        var rightDrawer = drawer.initRightMenu(cartWebView.address);
        return rightDrawer;
    });

    // Add the account web view to the left drawer
    var leftDrawerPromise = Promise.join(accountWebViewPromise, drawerPromise, function(accountWebView, drawer) {
        var leftDrawer = drawer.initLeftMenu(accountWebView.address);
        return leftDrawer;
    });

    Promise.join(rightDrawerPromise, headerPromise, function(rightDrawer, header) {
        header.on('rightIconClick', function() {
            rightDrawer.toggle();
        });
    });

    Promise.join(leftDrawerPromise, headerPromise, function(leftDrawer, header) {
        header.on('leftIconClick', function() {
            leftDrawer.toggle();
        });
    });

    Promise.join(mainWebViewPromise, rightDrawerPromise, function(mainWebView, rightDrawer) {
        mainWebView.on('addToCartClicked', function() {
            rightDrawer.open();
        });
    });

}, undefined, true);
