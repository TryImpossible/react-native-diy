package com.splitbundle.ui;

import com.facebook.react.BaseReactActivity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class Business3Activity extends BaseReactActivity {
    @Nullable
    @Override
    protected String getMainComponentName() {
        return "business3";
    }

    @NonNull
    @Override
    public JSBundleLoaderType getJSBundleLoaderType() {
        return JSBundleLoaderType.ASSET;
    }

    @NonNull
    @Override
    public String getJSBundleURL() {
        return "assets://business3.android.bundle";
    }
}
