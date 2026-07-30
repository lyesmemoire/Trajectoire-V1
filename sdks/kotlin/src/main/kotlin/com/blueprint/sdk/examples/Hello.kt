package com.blueprint.sdk.examples

import com.blueprint.sdk.Blueprint

fun main() {
    val bp = Blueprint()
    println(bp.hello())
    println("SDK Version: ${bp.getVersion()}")
}
