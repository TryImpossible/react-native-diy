package com.facebook.react;

public class JSBundleBean {
    public enum LoaderType {ASSET, FILE, NETWORK}

    private LoaderType loaderType;
    private String url;

    public JSBundleBean(LoaderType loaderType, String url) {
        this.loaderType = loaderType;
        this.url = url;
    }

    public LoaderType getLoaderType() {
        return loaderType;
    }

    public void setLoaderType(LoaderType loaderType) {
        this.loaderType = loaderType;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
