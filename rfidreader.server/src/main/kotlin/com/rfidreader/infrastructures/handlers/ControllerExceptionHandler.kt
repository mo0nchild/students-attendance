package com.rfidreader.infrastructures.handlers

import com.rfidreader.infrastructures.exceptions.ProcessException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ControllerExceptionHandler() {
    @ExceptionHandler(ProcessException::class)
    fun handleProcessException(error: ProcessException): ResponseEntity<String> {
        return ResponseEntity(error.message, HttpStatus.BAD_REQUEST)
    }
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationExceptions(ex: MethodArgumentNotValidException): ResponseEntity<*> {
        val errors = ex.bindingResult.fieldErrors.map { it.defaultMessage }
        return ResponseEntity.badRequest().body(errors)
    }
}