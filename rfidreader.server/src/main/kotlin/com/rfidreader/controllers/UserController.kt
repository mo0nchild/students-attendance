package com.rfidreader.controllers

import com.rfidreader.services.students.StudentService
import com.rfidreader.services.students.models.StudentDto
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(private val studentService: StudentService) {

    @GetMapping
    fun getAllStudents(): List<StudentDto> = studentService.getAllStudents()
}