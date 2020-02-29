package com.splitbundle.ui;

import android.os.Environment;

import com.facebook.react.BaseReactActivity;

import java.io.File;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class Business2Activity extends BaseReactActivity {
    @Nullable
    @Override
    protected String getMainComponentName() {
        return "business2";
    }

    @NonNull
    @Override
    public JSBundleLoaderType getJSBundleLoaderType() {
        return JSBundleLoaderType.FILE;
    }

    @NonNull
    @Override
    public String getJSBundleURL() {
        return new File(Environment.getExternalStorageDirectory(), "business2.android.bundle").getAbsolutePath();
    }
}
