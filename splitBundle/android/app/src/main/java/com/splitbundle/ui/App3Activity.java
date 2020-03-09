package com.splitbundle.ui;

import com.facebook.react.JSBundleBean;
import com.facebook.react.MyReactActivity;

import java.util.Arrays;
import java.util.List;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class App3Activity extends MyReactActivity {
    @Nullable
    @Override
    protected String getMainComponentName() {
        return "app3";
    }

    @NonNull
    @Override
    protected JSBundleBean.LoaderType getJSBundleLoaderType() {
        return JSBundleBean.LoaderType.ASSET;
    }

    @NonNull
    @Override
    protected String getJSBundleURL() {
        return "assets://app3.android.bundle";
    }

    @NonNull
    @Override
    protected List<JSBundleBean> getJSBundle() {
        JSBundleBean jsBundle = new JSBundleBean(JSBundleBean.LoaderType.ASSET, "assets://app2.android.bundle");
        return Arrays.asList(jsBundle);
    }

    @NonNull
    @Override
    protected boolean getUseDeveloperSupport() {
        return false;
    }
}
