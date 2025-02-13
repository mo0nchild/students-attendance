package com.rfidreader.services.students

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.infrastructures.repositories.GroupRepository
import com.rfidreader.infrastructures.repositories.StudentRepository
import com.rfidreader.services.groups.models.GroupMapper
import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.SearchStudentInfo
import com.rfidreader.services.students.models.StudentDto
import com.rfidreader.services.students.models.StudentMapper
import com.rfidreader.services.students.models.UpdateStudent
import jakarta.validation.Validator
import org.apache.poi.ss.format.CellFormatPart.group
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class StudentServiceImpl(
    private val studentRepository: StudentRepository,
    private val validator: Validator
) : StudentService {
    private val studentMapper = StudentMapper.INSTANCE
    private val groupMapper = GroupMapper.INSTANCE
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
    override fun addAllStudents(newStudents: List<NewStudent>): Unit {
        for(item in newStudents) {
           if (newStudents.filter { it.rfidCode == item.rfidCode }.size > 1) {
               throw ProcessException("RfidCode ${item.rfidCode} duplicate")
           }
        }
        newStudents.forEach { addStudent(it) }
    }
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
        studentRepository.getStudentsByRfidCode(student.rfidCode).let { if (it.isEmpty()) null else it.first() } ?.let {
            if(it.id != student.id) throw ProcessException("RfidCode already exists: $it")
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
    override fun getStudentByRfidCode(rfidCode: String): StudentDto {
        return studentRepository.getStudentsByRfidCode(rfidCode).let {
            if (it.isEmpty()) throw ProcessException("Student not found")
            studentMapper.toStudentDto(it.first())
        }
    }
    override fun findStudentByFio(fio: String): List<SearchStudentInfo> {
        if (fio.length <= 3) throw ProcessException("FIO length should be more than 3 characters")
        var results = mutableListOf<SearchStudentInfo>()
        var students = studentRepository.getStudentsByFio(fio).groupBy { it.group?.id }
        for ((key, studentList) in students) {
            var group = groupRepository.findById(key!!).let {
                if (it.isEmpty) null
                else SearchStudentInfo(
                    students=studentList.map(studentMapper::toStudentDto),
                    group=groupMapper.toGroupDto(it.get()))
            }
            if (group != null) results.add(group)
        }
        return results
    }
    override fun getAllStudents(): List<StudentDto> {
        return studentRepository.findAll().map { studentMapper.toStudentDto(it) }
    }
    override fun getStudentById(id: Long): StudentDto {
        return studentRepository.findById(id).map { studentMapper.toStudentDto(it) }
            .orElseThrow { ProcessException("Student not found") }
    }
}