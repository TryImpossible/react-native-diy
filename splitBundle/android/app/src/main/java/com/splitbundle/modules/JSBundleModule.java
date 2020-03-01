package com.splitbundle.modules;

import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.splitbundle.MainApplication;
import com.splitbundle.utils.JSBundleLoaderUtil;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Handler;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class JSBundleModule extends ReactContextBaseJavaModule {

    private static final String NAME = JSBundleModule.class.getSimpleName();
    private static final String ASSET = "asset";
    private static final String FILE = "file";
    private static final String NETWORK = "network";

    public JSBundleModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void load(String bundleType, String bundleName) {
        if (bundleType.equals(ASSET)) {
            JSBundleLoaderUtil.loadScriptFromAssets(getReactApplicationContext().getCatalystInstance(), getCurrentActivity(), bundleName, false);
        }
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();
        constants.put("ASSET", ASSET);
        constants.put("FILE", FILE);
        constants.put("NETWORK", NETWORK);
        return constants;
    }
}
