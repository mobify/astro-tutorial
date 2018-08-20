window.AstroMessages = []; // For debugging messages

// Astro
import Application from 'astro/application';
import AnchoredLayoutPlugin from 'astro/plugins/anchoredLayoutPlugin';
import NavigationPlugin from 'astro/plugins/navigationPlugin';

import Promise from 'bluebird';

window.run = async function() {

    // Enter your site url here
    const baseUrl = 'http://<Your IP Address>:5000/';

    // Initialize plugins
    const mainNavigationPromise = NavigationPlugin.init();
    const layoutPromise = AnchoredLayoutPlugin.init();

    const [
        layout,
        mainNavigationView
    ] = await Promise.all([
        layoutPromise,
        mainNavigationPromise
    ]);

    // Start the app by navigating to the base url
    mainNavigationView.navigateToUrl(baseUrl);

    // Use the mainNavigationView as the main content view for our layout
    layout.setContentView(mainNavigationView);
    Application.dismissLaunchImage();

    // Set our layout as the main view of the app
    Application.setMainViewPlugin(layout);
};
// Comment out next line for JS debugging
window.run();
