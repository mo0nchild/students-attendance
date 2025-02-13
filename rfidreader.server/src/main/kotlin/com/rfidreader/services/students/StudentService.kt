package com.rfidreader.services.students

import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.SearchStudentInfo
import com.rfidreader.services.students.models.StudentDto
import com.rfidreader.services.students.models.UpdateStudent

interface StudentService {
    fun getAllStudents(): List<StudentDto>
    fun getStudentById(id: Long): StudentDto

    fun addAllStudents(newStudents: List<NewStudent>): Unit
    fun addStudent(newStudent: NewStudent): Unit
    fun deleteStudentById(id: Long): Unit
    fun updateStudent(student: UpdateStudent): Unit

    fun getStudentsByGroupId(groupId: Long): List<StudentDto>
    fun getStudentByRfidCode(rfidCode: String): StudentDto
    fun findStudentByFio(fio: String): List<SearchStudentInfo>
}