package com.rfidreader.services.students

import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.StudentDto

interface StudentService {
    fun getAllStudents(): List<StudentDto>
    fun getStudentById(id: Long): StudentDto

    fun addStudent(newStudent: NewStudent): Unit
    fun deleteStudentById(id: Long): Unit

    fun getStudentsByGroupId(groupId: Long): List<StudentDto>
}