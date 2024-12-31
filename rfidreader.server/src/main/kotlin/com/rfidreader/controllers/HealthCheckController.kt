package com.rfidreader.controllers

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HealthCheckController {
    @GetMapping("/healthcheck")
    fun getHealthCheck(): ResponseEntity<String> = ResponseEntity.ok("Health check successfully ")
}