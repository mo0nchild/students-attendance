package com.rfidreader.infrastructures.handlers

import com.rfidreader.infrastructures.exceptions.ProcessException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class ControllerExceptionHandler {
    @ExceptionHandler(ProcessException::class)
    fun handleProcessException(error: ProcessException): ResponseEntity<String> {
        return ResponseEntity(error.message, HttpStatus.BAD_REQUEST)
    }
}