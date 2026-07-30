package com.blueprint.sdk.examples;

import com.blueprint.sdk.Blueprint;

public class Hello {
    public static void main(String[] args) {
        Blueprint bp = new Blueprint();
        System.out.println(bp.hello());
        System.out.println("SDK Version: " + bp.getVersion());
    }
}
