package com.facebook.react;

import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.JSIModulePackage;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.devsupport.DoubleTapReloadRecognizer;
import com.facebook.react.devsupport.RedBoxHandler;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.uimanager.UIImplementationProvider;
import com.splitbundle.utils.JSBundleLoaderUtil;

import java.util.Iterator;
import java.util.List;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public abstract class BaseReactActivity extends AppCompatActivity
        implements DefaultHardwareBackBtnHandler, PermissionAwareActivity {

    private @Nullable
    PermissionListener mPermissionListener;
    private @Nullable
    Callback mPermissionsCallback;
    @Nullable
    private DoubleTapReloadRecognizer mDoubleTapReloadRecognizer;
    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setTheme(com.facebook.react.R.style.Theme_AppCompat_Light_NoActionBar);

        mDoubleTapReloadRecognizer = new DoubleTapReloadRecognizer();

        mReactRootView = createReactRootView();
        mReactInstanceManager = createReactInstanceManager();

        if (!mReactInstanceManager.hasStartedCreatingInitialContext()) {
            mReactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                // 初始化react上下文时调用（所有模块都已注册）
                @Override
                public void onReactContextInitialized(ReactContext context) {
                    loadJSBundle();
                    mReactRootView.startReactApplication(mReactInstanceManager, getMainComponentName(), getLaunchOptions());
                    setContentView(mReactRootView);
                    getReactInstanceManager().removeReactInstanceEventListener(this);
                }
            });
            mReactInstanceManager.createReactContextInBackground();
        } else {
            loadJSBundle();
            mReactRootView.startReactApplication(mReactInstanceManager, getMainComponentName(), getLaunchOptions());
            setContentView(mReactRootView);
        }
    }

    private ReactRootView createReactRootView() {
        return new ReactRootView(this);
    }

    private ReactInstanceManager createReactInstanceManager() {
        ReactInstanceManagerBuilder builder =
                ReactInstanceManager.builder()
                        .setApplication(getApplication())
                        .setCurrentActivity(this)
                        .setBundleAssetName(getBundleAssetName())
                        .setJSMainModulePath(getJSMainModuleName())
                        .addPackage(new MainReactPackage())
                        .setUseDeveloperSupport(getUseDeveloperSupport())
                        .setRedBoxHandler(getRedBoxHandler())
                        .setJavaScriptExecutorFactory(getJavaScriptExecutorFactory())
                        .setUIImplementationProvider(getUIImplementationProvider())
                        .setJSIModulesPackage(getJSIModulePackage())
                        .setInitialLifecycleState(LifecycleState.BEFORE_CREATE);

        if (getPackages() != null && getPackages().size() > 0) {
            for (ReactPackage reactPackage : getPackages()) {
                builder.addPackage(reactPackage);
            }
        }

        String jsBundleFile = getJSBundleFile();
        if (jsBundleFile != null) {
            builder.setJSBundleFile(jsBundleFile);
        }
        ReactInstanceManager reactInstanceManager = builder.build();
        return reactInstanceManager;
    }

    /**
     * 加载业务包
     */
    private void loadJSBundle() {
        if (getJSBundle() == null) {
            return;
        }
        CatalystInstance catalystInstance = mReactInstanceManager.getCurrentReactContext().getCatalystInstance();
        Iterator<JSBundleBean> iterator = getJSBundle().iterator();
        while (iterator.hasNext()) {
            JSBundleBean jsBundle = iterator.next();
            if (jsBundle.getLoaderType() == JSBundleBean.LoaderType.ASSET) {
                JSBundleLoaderUtil.loadScriptFromAssets(catalystInstance, getApplicationContext(), jsBundle.getUrl(), false, false);
            } else if (jsBundle.getLoaderType() == JSBundleBean.LoaderType.FILE) {
                String filePath = jsBundle.getUrl();
                String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
                JSBundleLoaderUtil.loadScriptFromFile(catalystInstance, filePath, fileName, false, false);
            }
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (hasInstance()) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (hasInstance()) {
            mReactInstanceManager.onHostResume(this, this);
        }
        if (mPermissionsCallback != null) {
            mPermissionsCallback.invoke();
            mPermissionsCallback = null;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (hasInstance()) {
            mReactInstanceManager.onHostDestroy(this);
        }
        if (mReactRootView != null) {
            mReactRootView.unmountReactApplication();
            mReactRootView = null;
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (hasInstance()) {
            mReactInstanceManager.onActivityResult(this, requestCode, resultCode, data);
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (hasInstance() && getUseDeveloperSupport() && keyCode == KeyEvent.KEYCODE_MEDIA_FAST_FORWARD) {
            event.startTracking();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (hasInstance() && getUseDeveloperSupport()) {
            if (keyCode == KeyEvent.KEYCODE_MENU) {
                mReactInstanceManager.showDevOptionsDialog();
                return true;
            }
            boolean didDoubleTapR = Assertions.assertNotNull(mDoubleTapReloadRecognizer).didDoubleTapR(keyCode, getCurrentFocus());
            if (didDoubleTapR) {
                mReactInstanceManager.getDevSupportManager().handleReloadJS();
                return true;
            }
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public boolean onKeyLongPress(int keyCode, KeyEvent event) {
        if (hasInstance() && getUseDeveloperSupport() && keyCode == KeyEvent.KEYCODE_MEDIA_FAST_FORWARD) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyLongPress(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        if (hasInstance()) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    public void onNewIntent(Intent intent) {
        if (hasInstance()) {
            mReactInstanceManager.onNewIntent(intent);
        } else {
            super.onNewIntent(intent);
        }
    }

    @Override
    public void requestPermissions(
            String[] permissions, int requestCode, PermissionListener listener) {
        mPermissionListener = listener;
        requestPermissions(permissions, requestCode);
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode, String[] permissions, int[] grantResults) {
        mPermissionsCallback =
                new Callback() {
                    @Override
                    public void invoke(Object... args) {
                        if (mPermissionListener != null
                                && mPermissionListener.onRequestPermissionsResult(
                                requestCode, permissions, grantResults)) {
                            mPermissionListener = null;
                        }
                    }
                };
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasInstance()) {
            mReactInstanceManager.onWindowFocusChange(hasFocus);
        }
    }

    public ReactInstanceManager getReactInstanceManager() {
        if (!hasInstance()) {
            mReactInstanceManager = createReactInstanceManager();
        }
        return mReactInstanceManager;
    }

    public boolean hasInstance() {
        return mReactInstanceManager != null;
    }

    public void clear() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.destroy();
            mReactInstanceManager = null;
        }
    }

    public ReactRootView getReactRootView() {
        if (mReactRootView == null) {
            mReactRootView = createReactRootView();
        }
        return mReactRootView;
    }

    protected @Nullable
    RedBoxHandler getRedBoxHandler() {
        return null;
    }

    protected @Nullable
    JavaScriptExecutorFactory getJavaScriptExecutorFactory() {
        return null;
    }

    protected UIImplementationProvider getUIImplementationProvider() {
        return new UIImplementationProvider();
    }

    protected @Nullable
    JSIModulePackage getJSIModulePackage() {
        return null;
    }

    protected String getJSMainModuleName() {
        return "index";
    }

    protected @Nullable
    String getJSBundleFile() {
        return null;
    }

    protected @Nullable
    String getBundleAssetName() {
        return "basics.android.bundle";
    }

    protected @Nullable
    boolean getUseDeveloperSupport() {
        return false;
    }

    protected @Nullable
    List<ReactPackage> getPackages() {
        return null;
    }

    protected @Nullable
    String getMainComponentName() {
        return null;
    }

    protected @Nullable
    Bundle getLaunchOptions() {
        return null;
    }

    protected @NonNull
    List<JSBundleBean> getJSBundle() {
        return null;
    }
}
