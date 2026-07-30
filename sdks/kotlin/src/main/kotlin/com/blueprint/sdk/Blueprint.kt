package com.blueprint.sdk

/**
 * Blueprint SDK for Kotlin
 */
class Blueprint {
    private val version: String = "1.0.0"
    
    /**
     * Returns a greeting message
     */
    fun hello(): String {
        return "Hello from Blueprint SDK!"
    }
    
    /**
     * Returns the SDK version
     */
    fun getVersion(): String {
        return version
    }
}
