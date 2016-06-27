package com.mobify.astro.velo;

import android.os.Bundle;

import com.mobify.astro.AstroActivity;
import com.mobify.astro.plugins.AlertViewPlugin;
import com.mobify.astro.plugins.AnchoredLayoutPlugin;
import com.mobify.astro.plugins.AstroWorker;
import com.mobify.astro.plugins.ListSelectPlugin;
import com.mobify.astro.plugins.counterbadgeplugin.CounterBadgePlugin;
import com.mobify.astro.plugins.SecureStorePlugin;
import com.mobify.astro.plugins.SharingPlugin;
import com.mobify.astro.plugins.TabBarPlugin;
import com.mobify.astro.plugins.headerbarplugin.HeaderBarPlugin;
import com.mobify.astro.plugins.loaders.DefaultLoaderPlugin;
import com.mobify.astro.plugins.ImageViewPlugin;
import com.mobify.astro.plugins.ModalViewPlugin;
import com.mobify.astro.plugins.DrawerPlugin;
import com.mobify.astro.plugins.NavigationPlugin;
import com.mobify.astro.plugins.webviewplugin.WebViewPlugin;

import org.apache.cordova.CordovaWebView;

public class MainActivity extends AstroActivity {
    protected AstroWorker worker;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Create the initial worker.
        worker = new AstroWorker(this, pluginManager);
    }
}
