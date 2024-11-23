package com.rfidreader.services.students

import com.rfidreader.services.students.models.GroupDto
import com.rfidreader.services.students.models.NewGroup
import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.StudentDto
import org.springframework.stereotype.Service

@Service
interface StudentService {
    fun getAllStudents(): List<StudentDto>
    fun getStudentById(id: Long): StudentDto

    fun addStudent(newStudent: NewStudent): Unit
    fun deleteStudentById(id: Long): Unit

    fun addGroup(newGroup: NewGroup): Unit
    fun deleteGroup(id: Long): Unit

    fun getAllGroups(): List<GroupDto>
    fun getStudentsByGroupId(groupId: Long): List<StudentDto>
}