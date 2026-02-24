package com.blogsystems.app;

import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onStart() {
        super.onStart();
        WebView webView = getBridge().getWebView();
        WebSettings webSettings = webView.getSettings();
        //方便本地后台调试，即https的页面可调用http后台
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
    }
}



//        android:usesCleartextTraffic="true"