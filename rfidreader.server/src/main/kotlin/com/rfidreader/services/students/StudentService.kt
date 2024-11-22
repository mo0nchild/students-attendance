package com.rfidreader.services.students

import com.rfidreader.infrastructures.Results
import com.rfidreader.repositories.GroupRepository
import com.rfidreader.repositories.StudentRepository
import com.rfidreader.services.students.mappers.StudentMapper
import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.StudentDto
import org.springframework.stereotype.Service

@Service
class StudentService(
    private val studentRepository: StudentRepository,
    private val groupRepository: GroupRepository,
) {
    private val mapper = StudentMapper.INSTANCE
    fun addStudent(newStudent: NewStudent): Results {
        val group = groupRepository.findById(newStudent.groupId).let {
            when(it.isEmpty) {
                false -> it.get()
                true -> null
            }
        } ?: return Results("Group not found")
        val entity = mapper.toStudentEntity(newStudent)
        studentRepository.save(entity)
        return Results("Student saved")
    }
    fun getAllStudents(): List<StudentDto> {
        return studentRepository.findAll().map { mapper.toStudentDto(it) }
    }
}