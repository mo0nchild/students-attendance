package com.rfidreader.services.students

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.infrastructures.repositories.GroupRepository
import com.rfidreader.infrastructures.repositories.StudentRepository
import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.StudentDto
import com.rfidreader.services.students.models.StudentMapper
import com.rfidreader.services.students.models.UpdateStudent
import jakarta.validation.Validator
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class StudentServiceImpl(
    private val studentRepository: StudentRepository,
    private val validator: Validator
) : StudentService {
    private val studentMapper = StudentMapper.INSTANCE
    @Autowired
    private lateinit var groupRepository: GroupRepository

    @Transactional
    override fun addStudent(newStudent: NewStudent): Unit {
        validator.validate(newStudent).let {
            if(it.isNotEmpty()) throw ProcessException(it.first().message)
        }
        studentRepository.getStudentsByRfidCode(newStudent.rfidCode).let {
            if(it.isNotEmpty()) throw ProcessException("RfidCode already exists: ${it[0]}")
        }
        val entity = studentMapper.toStudentEntity(newStudent)
        studentRepository.saveWithGroup(entity, newStudent.groupId)
    }
    @Transactional
    override fun addAllStudents(newStudents: List<NewStudent>): Unit = newStudents.forEach { addStudent(it) }

    @Transactional
    override fun deleteStudentById(id: Long) {
        val entity = studentRepository.findById(id).orElseThrow { ProcessException("Student not found") }
        studentRepository.delete(entity)
    }
    @Transactional
    override fun updateStudent(student: UpdateStudent) {
        validator.validate(student).let {
            if(it.isNotEmpty()) throw ProcessException(it.first().message)
        }
        studentRepository.getStudentsByRfidCode(student.rfidCode).let {
            if(it.isNotEmpty()) throw ProcessException("RfidCode already exists: ${it[0]}")
        }
        val entity = studentRepository.findById(student.id)
            .orElseThrow { ProcessException("Student not found") }
            .also {
                it.surname = student.surname
                it.name = student.name
                it.patronymic = student.patronymic
                it.group = groupRepository.findById(student.groupId)
                    .orElseThrow { ProcessException("Group not found") }
                it.rfidCode = student.rfidCode
            }
        studentRepository.save(entity)
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