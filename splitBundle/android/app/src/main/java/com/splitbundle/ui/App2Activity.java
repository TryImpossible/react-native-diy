package com.splitbundle.ui;

import com.facebook.react.JSBundleBean;
import com.facebook.react.MyReactActivity;

import java.util.Arrays;
import java.util.List;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class App2Activity extends MyReactActivity {
    @Nullable
    @Override
    protected String getMainComponentName() {
        return "app2";
    }

    @NonNull
    @Override
    protected List<JSBundleBean> getJSBundle() {
//        JSBundleBean.LoaderType type = JSBundleBean.LoaderType.FILE;
//        String url = new File(Environment.getExternalStorageDirectory(), "app2.android.bundle").getAbsolutePath();
        return Arrays.asList(new JSBundleBean(JSBundleBean.LoaderType.ASSET, "assets://app2.android.bundle"));
    }

    @Nullable
    @Override
    protected boolean getUseDeveloperSupport() {
        return true;
    }
}
