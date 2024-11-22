package com.rfidreader.services.students

import com.rfidreader.repositories.StudentRepository
import com.rfidreader.services.students.models.StudentDto
import org.springframework.stereotype.Service

@Service
class StudentService(private val studentRepository: StudentRepository) {
    fun getAllStudents(): List<StudentDto> {
        return listOf();
    }
}