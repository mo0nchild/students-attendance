package com.rfidreader.controllers

import com.rfidreader.infrastructures.Results
import com.rfidreader.services.students.StudentServiceImpl
import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.StudentDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/students")
class StudentController(private val studentService: StudentServiceImpl) {

    @GetMapping("/getAll")
    fun getAllStudents(): ResponseEntity<List<StudentDto>> {
        try {
            val result = studentService.getAllStudents()
            return ResponseEntity.ok(result)
        }
        catch (error: Exception) {
            println(error.message)
            throw error
        }
    }
    @PostMapping("/add")
    fun addStudent(@RequestBody student: NewStudent): ResponseEntity<String> {
        studentService.addStudent(student)
        return ResponseEntity.ok("All good")
    }
    @GetMapping("/get/{id}")
    fun getStudent(@PathVariable id: Long): ResponseEntity<StudentDto> {
        try {
            val result = studentService.getStudentById(id)
            return ResponseEntity.ok(result)
        }
        catch (error: Exception) {
            println(error.message)
            throw error
        }
    }
}