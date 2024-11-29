package com.rfidreader.services.students

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.repositories.StudentRepository
import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.StudentDto
import com.rfidreader.services.students.models.StudentMapper
import jakarta.validation.Validator
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class StudentServiceImpl(
    private val studentRepository: StudentRepository,
    private val validator: Validator
) : StudentService {
    private val studentMapper = StudentMapper.INSTANCE

    @Transactional
    override fun addStudent(newStudent: NewStudent): Unit {
        validator.validate(newStudent).let {
            if(it.isNotEmpty()) throw ProcessException(it.first().message)
        }
        studentRepository.getStudentsByRfidCode(newStudent.rfidCode).let {
            if(it.isNotEmpty()) throw ProcessException("RfidCode already exists")
        }
        val entity = studentMapper.toStudentEntity(newStudent)
        studentRepository.saveWithGroup(entity, newStudent.groupId)
    }
    @Transactional
    override fun deleteStudentById(id: Long) {
        val entity = studentRepository.findById(id).orElseThrow { ProcessException("Student not found") }
        studentRepository.delete(entity)
    }
    override fun getStudentsByGroupId(groupId: Long): List<StudentDto> {
        return studentRepository.getStudentByGroupId(groupId).map { studentMapper.toStudentDto(it) }
    }
    override fun getAllStudents(): List<StudentDto> {
        return studentRepository.findAll().map { studentMapper.toStudentDto(it) }
    }
    override fun getStudentById(id: Long): StudentDto {
        return studentRepository.findById(id).map { studentMapper.toStudentDto(it) }
            .orElseThrow { ProcessException("Student not found") }
    }
}