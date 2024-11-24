package com.rfidreader.infrastructures.exceptions


class ProcessException(message: String): Exception(message) {
    override fun toString(): String = "Error: $message"

}