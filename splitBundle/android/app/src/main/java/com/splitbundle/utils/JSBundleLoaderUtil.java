package com.splitbundle.utils;

import android.content.Context;

import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.CatalystInstanceImpl;

import java.util.HashSet;
import java.util.Set;

public class JSBundleLoaderUtil {

    // 记录加载的JSBundle
    private static Set<String> sJSBundleSet = new HashSet<>();

    public static void loadScriptFromAssets(CatalystInstance catalystInstance, Context context, String assetURL, boolean loadSynchronously) {
        loadScriptFromAssets(catalystInstance, context, assetURL, loadSynchronously, true);
    }

    /**
     * 从Assets目录下加载
     *
     * @param catalystInstance
     * @param context
     * @param assetURL
     * @param loadSynchronously
     * @param isCheck
     */
    public static void loadScriptFromAssets(CatalystInstance catalystInstance, Context context, String assetURL, boolean loadSynchronously, boolean isCheck) {
        // 判断是否加载，防止重复加载
        if (isCheck && sJSBundleSet.contains(assetURL)) {
            return;
        }

        String source = assetURL;
        if (!assetURL.startsWith("assets://")) {
            source = "assets://" + assetURL;
        }
        ((CatalystInstanceImpl) catalystInstance).loadScriptFromAssets(context.getAssets(), source, loadSynchronously);

        if (isCheck) {
            sJSBundleSet.add(source);
        }
    }

    public static void loadScriptFromFile(CatalystInstance catalystInstance, String fileName, String sourceURL, boolean loadSynchronousl) {
        loadScriptFromFile(catalystInstance, fileName, sourceURL, loadSynchronousl, true);
    }

    /**
     * 从指定目录下加载
     *
     * @param catalystInstance
     * @param fileName          文件的绝对路径
     * @param sourceURL         文件名称
     * @param loadSynchronously
     * @param isCheck
     */
    public static void loadScriptFromFile(CatalystInstance catalystInstance, String fileName, String sourceURL, boolean loadSynchronously, boolean isCheck) {
        // 判断是否加载，防止重复加载
        if (isCheck && sJSBundleSet.contains(sourceURL)) {
            return;
        }

        ((CatalystInstanceImpl) catalystInstance).loadScriptFromFile(fileName, sourceURL, loadSynchronously);

        if (isCheck) {
            sJSBundleSet.add(sourceURL);
        }
    }

    /**
     * 返回已运行的JS Bundle的源URL，如果尚未运行JS bundle，则返回 null
     *
     * @param catalystInstance
     * @return
     */
    public static String getSourceURL(CatalystInstance catalystInstance) {
        return ((CatalystInstanceImpl) catalystInstance).getSourceURL();
    }
}
