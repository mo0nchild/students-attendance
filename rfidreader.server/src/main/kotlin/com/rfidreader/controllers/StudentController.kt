package com.rfidreader.controllers

import com.rfidreader.services.students.StudentServiceImpl
import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.StudentDto
import com.rfidreader.services.students.models.UpdateStudent
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/students")
class StudentController(private val studentService: StudentServiceImpl) {
    @GetMapping("/getAll")
    fun getAllStudents(): ResponseEntity<List<StudentDto>> {
        return ResponseEntity.ok(studentService.getAllStudents())
    }
    @PostMapping("/addAll")
    fun addStudent(@RequestBody student: List<NewStudent>): ResponseEntity<String> {
        studentService.addAllStudents(student)
        return ResponseEntity.ok("Students successfully added")
    }
    @PostMapping("/add")
    fun addStudent(@RequestBody student: NewStudent): ResponseEntity<String> {
        studentService.addStudent(student)
        return ResponseEntity.ok("Student successfully added")
    }
    @DeleteMapping("/remove/{id}")
    fun removeStudent(@PathVariable id: Long): ResponseEntity<String> {
        studentService.deleteStudentById(id)
        return ResponseEntity.ok("Student successfully removed")
    }
    @PutMapping("/update")
    fun updateStudent(@RequestBody student: UpdateStudent): ResponseEntity<String> {
        studentService.updateStudent(student)
        return ResponseEntity.ok("Student successfully updated")
    }
    @GetMapping("/get/{id}")
    fun getStudentById(@PathVariable id: Long): ResponseEntity<StudentDto> {
        return ResponseEntity.ok(studentService.getStudentById(id))
    }
    @GetMapping("/getAll/group/{id}")
    fun getStudentsByGroupId(@PathVariable id: Long): ResponseEntity<List<StudentDto>> {
        return ResponseEntity.ok(studentService.getStudentsByGroupId(id))
    }
}