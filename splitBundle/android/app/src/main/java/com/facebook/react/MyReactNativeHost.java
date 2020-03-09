package com.facebook.react;

import android.app.Application;

import com.facebook.react.PackageList;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.splitbundle.modules.JSBundlePackage;

import java.util.List;

import androidx.annotation.Nullable;

public class MyReactNativeHost extends ReactNativeHost {

    private boolean isUseDeveloperSupport = false;

    public void setUseDeveloperSupport(boolean useDeveloperSupport) {
        isUseDeveloperSupport = useDeveloperSupport;
    }

    public MyReactNativeHost(Application application) {
        super(application);
    }

    @Override
    public boolean getUseDeveloperSupport() {
        return isUseDeveloperSupport;
    }

    @Override
    protected List<ReactPackage> getPackages() {
        @SuppressWarnings("UnnecessaryLocalVariable")
        List<ReactPackage> packages = new PackageList(this).getPackages();
        packages.add(new JSBundlePackage());
        // Packages that cannot be autolinked yet can be added manually here, for example:
        // packages.add(new MyReactNativePackage());
        return packages;
    }

    /**
     * 优先加载基础包
     *
     * @return
     */
    @Nullable
    @Override
    protected String getBundleAssetName() {
        return "basics.android.bundle";
    }

    @Override
    protected String getJSMainModuleName() {
        return "index";
    }
}
