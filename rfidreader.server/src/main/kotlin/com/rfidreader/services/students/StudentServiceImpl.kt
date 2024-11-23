package com.rfidreader.services.students

import com.rfidreader.infrastructures.Results
import com.rfidreader.repositories.GroupRepository
import com.rfidreader.repositories.StudentRepository
import com.rfidreader.services.students.mappers.GroupMapper
import com.rfidreader.services.students.mappers.StudentMapper
import com.rfidreader.services.students.models.GroupDto
import com.rfidreader.services.students.models.NewGroup
import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.StudentDto
import org.springframework.stereotype.Service

@Service
class StudentServiceImpl(
    private val studentRepository: StudentRepository,
    private val groupRepository: GroupRepository,
) : StudentService {
    private val studentMapper = StudentMapper.INSTANCE
    private val groupMapper = GroupMapper.INSTANCE

    override fun addStudent(newStudent: NewStudent): Unit {
        val entity = studentMapper.toStudentEntity(newStudent)
        entity.group = (groupRepository.findById(newStudent.groupId).let {
            when(it.isEmpty) {
                false -> it.get()
                true -> null
            }
        } ?: throw Exception("Group not found"))
        studentRepository.save(entity)
    }
    override fun deleteStudentById(id: Long) {
        try { studentRepository.deleteById(id) }
        catch (error: Exception) {
            throw Exception(error.message)
        }
    }
    override fun addGroup(newGroup: NewGroup) {
        groupRepository.save(groupMapper.toGroupEntity(newGroup))
    }
    override fun deleteGroup(id: Long) {
        groupRepository.deleteById(id)
    }
    override fun getAllGroups(): List<GroupDto> {
        return groupRepository.findAll().map { groupMapper.toGroupDto(it) }
    }
    override fun getStudentsByGroupId(groupId: Long): List<StudentDto> {
        return studentRepository.getStudentByGroupId(groupId).map { studentMapper.toStudentDto(it) }
    }
    override fun getAllStudents(): List<StudentDto> {
        return studentRepository.findAll().map { studentMapper.toStudentDto(it) }
    }
    override fun getStudentById(id: Long): StudentDto {
        return studentRepository.findById(id).map { studentMapper.toStudentDto(it) }.orElseThrow()
    }
}