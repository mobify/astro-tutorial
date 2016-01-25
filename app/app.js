require([
    'astro-full',
    'bluebird',
    'application',
    'plugins/webViewPlugin',
    'plugins/anchoredLayoutPlugin',
    'plugins/navigationPlugin',
    'plugins/headerBarPlugin',
    'plugins/drawerPlugin'
],
function(
    Astro,
    Promise,
    Application,
    WebViewPlugin,
    AnchoredLayoutPlugin,
    NavigationPlugin,
    HeaderBarPlugin,
    DrawerPlugin
) {

    // Enter your site url here
    var baseUrl = 'http://localhost:5000';

    // Initialize plugins
    var mainNavigationPromise = NavigationPlugin.init();
    var layoutPromise         = AnchoredLayoutPlugin.init();
    var headerPromise         = HeaderBarPlugin.init();
    var drawerPromise         = DrawerPlugin.init();
    var cartWebViewPromise    = WebViewPlugin.init();
    var menuWebViewPromise    = WebViewPlugin.init();

    Promise.join(mainNavigationPromise, headerPromise, function(mainNavigationView, headerBar) {
        // Set up the header bar
        headerBar.setBackgroundColor("#E2E2E2");
        headerBar.setTextColor("#333333");
        headerBar.show();

        // Now, let's hook up the main navigation to the header bar
        mainNavigationView.setHeaderBar(headerBar);

        // Set the title from the web page
        mainNavigationView.on('setAppScreenTitle', function(title){
            headerBar.setCenterTitle(title, 'logo');
        });

        // Navigate to the base url
        mainNavigationView.navigate(baseUrl,{
            header: {
                leftIcon: {
                    id: 'account',
                    imageUrl: 'file:///account.png'
                },
                centerIcon: {
                    id: 'logo',
                    imageUrl: 'file:///velo.png'
                },
                rightIcon: {
                    id: 'cart',
                    imageUrl: 'file:///cart.png'
                }
            }
        });

        // iOS: When the back button is pressed navigate back
        headerBar.on('click:back', function() {
            mainNavigationView.back();
        });
    });

    // Use the mainNavigationView as the main content view for our layout
    Promise.join(layoutPromise, mainNavigationPromise, function(layout, mainNavigationView) {
        layout.setContentView(mainNavigationView);
    });

    // Add the header bar once `layoutPromise` and `headerPromise` are fulfilled.
    Promise.join(layoutPromise, headerPromise, function(layout, headerBar) {
        layout.addTopView(headerBar);
    });

    // Set the drawer's content area once `drawerPromise` and `layoutPromise` are fulfilled.
    Promise.join(drawerPromise, layoutPromise, function(drawer, layout) {
        drawer.setContentView(layout);
    });

    // Set our layout as the main view of the app
    drawerPromise.then(function(drawer) {
        Application.setMainViewPlugin(drawer);
    });

    // Navigate the cart webview to the right url
    cartWebViewPromise.then(function(webView) {
        webView.navigate(baseUrl + "/cart");
        webView.setBackgroundColor("#FFFFFF");
        // Disable navigation when links are pressed
        webView.disableDefaultNavigationHandler();
    });

    // Set the right drawer view to the cart web view instance once the promises have been fulfilled.
    var rightDrawerPromise = Promise.join(cartWebViewPromise, drawerPromise, function(cartWebView, drawer) {
        var rightDrawer = drawer.initRightMenu(cartWebView);
        // We want the right drawer later, so we will return it
        return rightDrawer;
    });

    // Open the right drawer when the cart button is clicked
    Promise.join(rightDrawerPromise, headerPromise, function(rightDrawer, header) {
        header.on('click:cart', function() {
            window.cordova.plugins.barcodeScanner.scan(function(result) {
                console.log(result);
                if (result.cancelled) {
                    return;
                }

                var barcodeMapping = {
                    'notfound': 'http://www.thinkgeek.com/product/aaaa/',
                    '9781472322531': 'https://www.thinkgeek.com/product/15b8/',
                    '011091212197': 'http://www.thinkgeek.com/product/edf6/',
                    '5024095212198': 'http://www.thinkgeek.com/product/edf6/'
                };

                var resultURL = result.text in barcodeMapping ? barcodeMapping[result.text] : barcodeMapping['notfound'];

                console.log('We got a barcode\n' +
                    'Result: ' + result.text + '\n' +
                    'Format: ' + result.format + '\n' +
                    'Cancelled: ' + result.cancelled);
            }, function(error) {
                console.log('Scanning failed: ' + error);
            });


            // TODO: uncomment and comment out the stuff above
            // rightDrawer.toggle();
        });
    });

    // Add a handler on the main web view to open drawer when 'addToCartClicked' event happens.
    Promise.join(mainNavigationPromise,
                    rightDrawerPromise,
                    cartWebViewPromise,
                    function(mainNavigationView, rightDrawer, cartWebView) {
        mainNavigationView.on('addToCartClicked', function() {
            // Open the right drawer
            rightDrawer.open();
            // Let the cart view know that something has been added
            cartWebView.trigger('cartUpdated');
        });
    });


    // Left Menu Navigation
    // -------------------------

    // Navigate the menu webview to the menu url
    Promise.join(menuWebViewPromise, mainNavigationPromise, function(menuWebView, mainNavigationView) {
        menuWebView.navigate(baseUrl + "/account");
        menuWebView.setBackgroundColor("#FFFFFF");
        // Disable navigation when links are pressed
        menuWebView.disableDefaultNavigationHandler();
    });

    // Set the left drawer view to the menu web view instance once the promises have been fulfilled.
    var leftDrawerPromise = Promise.join(menuWebViewPromise, drawerPromise, mainNavigationPromise, function(menuWebView, drawer, mainNavigationView) {
        var leftDrawer = drawer.initLeftMenu(menuWebView);

        // Navigate the main webview
        menuWebView.on('navigateMainView', function(url){
            url = baseUrl + url;
            leftDrawer.toggle();
            mainNavigationView.navigate(url, { stack: false });
        });

        // We want the right drawer later, so we will return it
        return leftDrawer;
    });

    // Open the left drawer when the account button is clicked
    Promise.join(leftDrawerPromise, headerPromise, function(leftDrawer, header) {
        header.on('click:account', function() {
            leftDrawer.toggle();
        });
    });


}, undefined, true);