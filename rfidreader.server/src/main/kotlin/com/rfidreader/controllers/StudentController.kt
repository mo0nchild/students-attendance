package com.rfidreader.controllers

import com.rfidreader.infrastructures.Results
import com.rfidreader.services.students.StudentService
import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.StudentDto
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/students")
class StudentController(private val studentService: StudentService) {

    @GetMapping("/getAll")
    fun getAllStudents(): List<StudentDto> {
        try {
            val result = studentService.getAllStudents()
            for(item in result) {
                println(item)
            }
            return result
        }
        catch (error: Exception) {
            println(error.message)
            throw error
        }
    }

    @PostMapping("/add")
    fun addStudent(student: NewStudent): Results = studentService.addStudent(student)

}