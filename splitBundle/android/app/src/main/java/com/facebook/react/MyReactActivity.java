package com.facebook.react;

import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;
import com.splitbundle.BuildConfig;
import com.splitbundle.utils.JSBundleLoaderUtil;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public abstract class MyReactActivity extends AppCompatActivity
        implements DefaultHardwareBackBtnHandler, PermissionAwareActivity {

    private final ReactActivityDelegate mDelegate;

    protected MyReactActivity() {
        mDelegate = createReactActivityDelegate();
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component. e.g. "MoviesApp"
     */
    protected @Nullable
    String getMainComponentName() {
        return null;
    }

    /**
     * Called at construction time, override if you have a custom delegate implementation.
     */
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, null) {
            @Override
            protected ReactNativeHost getReactNativeHost() {
                return super.getReactNativeHost();
            }
        };
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getReactNativeHost() != null) {
            ((MyReactNativeHost) getReactNativeHost()).setUseDeveloperSupport(getUseDeveloperSupport());
        }
        mDelegate.onCreate(savedInstanceState);
        initReactContext(new ReactContextListener() {
            @Override
            public void onComplete() {
                loadJSBundle();
                loadApp(getMainComponentName());
            }
        });
    }

    @Override
    protected void onPause() {
        super.onPause();
        mDelegate.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        mDelegate.onResume();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mDelegate.onDestroy();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        mDelegate.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        return mDelegate.onKeyDown(keyCode, event) || super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        return mDelegate.onKeyUp(keyCode, event) || super.onKeyUp(keyCode, event);
    }

    @Override
    public boolean onKeyLongPress(int keyCode, KeyEvent event) {
        return mDelegate.onKeyLongPress(keyCode, event) || super.onKeyLongPress(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        if (!mDelegate.onBackPressed()) {
            super.onBackPressed();
        }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    public void onNewIntent(Intent intent) {
        if (!mDelegate.onNewIntent(intent)) {
            super.onNewIntent(intent);
        }
    }

    @Override
    public void requestPermissions(
            String[] permissions, int requestCode, PermissionListener listener) {
        mDelegate.requestPermissions(permissions, requestCode, listener);
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode, String[] permissions, int[] grantResults) {
        mDelegate.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        mDelegate.onWindowFocusChanged(hasFocus);
    }

    protected final ReactNativeHost getReactNativeHost() {
        return mDelegate.getReactNativeHost();
    }

    protected final ReactInstanceManager getReactInstanceManager() {
        return mDelegate.getReactInstanceManager();
    }

    protected final void loadApp(String appKey) {
        mDelegate.loadApp(appKey);
    }

    public interface ReactContextListener {
        void onComplete();
    }

    private void initReactContext(@NonNull ReactContextListener listener) {

        // 判断是否初始化ReactContext,加载基础包
        if (!getReactInstanceManager().hasStartedCreatingInitialContext()) {
            getReactInstanceManager().addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                // 初始化react上下文时调用（所有模块都已注册）
                @Override
                public void onReactContextInitialized(ReactContext context) {
                    if (listener != null) {
                        listener.onComplete();
                    }
                    getReactInstanceManager().removeReactInstanceEventListener(this);
                }
            });
            // 这里预先加载基础包basic.android.bundle
            getReactInstanceManager().createReactContextInBackground();
        } else {
            if (listener != null) {
                listener.onComplete();
            }
        }
    }

    /**
     * 加载业务包
     */
    private void loadJSBundle() {
        CatalystInstance catalystInstance = getReactInstanceManager().getCurrentReactContext().getCatalystInstance();
        List<JSBundleBean> list = new ArrayList<>();
        list.add(new JSBundleBean(getJSBundleLoaderType(), getJSBundleURL()));
        if (getJSBundle() != null && getJSBundle().size() > 0) {
            list.addAll(getJSBundle());
        }
        Iterator<JSBundleBean> iterator = list.iterator();
        while (iterator.hasNext()) {
            JSBundleBean jsBundle = iterator.next();
            if (jsBundle.getLoaderType() == JSBundleBean.LoaderType.ASSET) {
                JSBundleLoaderUtil.loadScriptFromAssets(catalystInstance, getApplicationContext(), jsBundle.getUrl(), false);
            } else if (jsBundle.getLoaderType() == JSBundleBean.LoaderType.FILE) {
                String filePath = jsBundle.getUrl();
                String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
                JSBundleLoaderUtil.loadScriptFromFile(catalystInstance, filePath, fileName, false);
            }
        }
    }

    /**
     * 获取JSBundle加载类型
     *
     * @return
     */
    @NonNull
    protected abstract JSBundleBean.LoaderType getJSBundleLoaderType();

    /**
     * 获取JSBundle路径
     *
     * @return
     */
    @NonNull
    protected abstract String getJSBundleURL();

    /**
     * 获取JSBundle，用于加载多个JSBundle
     *
     * @return
     */
    @NonNull
    protected List<JSBundleBean> getJSBundle() {
        return null;
    }

    /**
     * 是否使用开发模式
     * 将方法暴露出来，ReactActivity根据需要修改
     *
     * @return
     */
    @NonNull
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }
}
