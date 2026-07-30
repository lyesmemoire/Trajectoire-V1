package com.blueprint.sdk;

/**
 * Blueprint SDK for Java
 */
public class Blueprint {
    private String version;
    
    public Blueprint() {
        this.version = "1.0.0";
    }
    
    /**
     * Returns a greeting message
     */
    public String hello() {
        return "Hello from Blueprint SDK!";
    }
    
    /**
     * Returns the SDK version
     */
    public String getVersion() {
        return version;
    }
}
