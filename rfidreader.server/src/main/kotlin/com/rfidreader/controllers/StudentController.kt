package com.rfidreader.controllers

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
        return ResponseEntity.ok(studentService.getAllStudents())
    }
    @PostMapping("/add")
    fun addStudent(@RequestBody student: NewStudent): ResponseEntity<String> {
        studentService.addStudent(student)
        return ResponseEntity.ok("Student successfully added")
    }
    @DeleteMapping("/remove/{id}")
    fun removeStudent(@PathVariable id: Long): ResponseEntity<String> {
        return ResponseEntity.ok("Student successfully removed")
    }
    @GetMapping("/get/{id}")
    fun getStudentById(@PathVariable id: Long): ResponseEntity<StudentDto> {
        return ResponseEntity.ok(studentService.getStudentById(id))
    }
    @GetMapping("/get/group/{id}")
    fun getStudentByGroupId(@PathVariable id: Long): ResponseEntity<List<StudentDto>> {
        return ResponseEntity.ok(studentService.getStudentsByGroupId(id))
    }
}