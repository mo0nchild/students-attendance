package com.rfidreader.services.students.mappers

import com.rfidreader.models.Group
import com.rfidreader.models.Student
import com.rfidreader.services.students.models.GroupDto
import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.StudentDto
import org.mapstruct.Mapper
import org.mapstruct.factory.Mappers

@Mapper(componentModel = "spring")
interface StudentMapper {
    fun toStudentDto(student: Student): StudentDto
    fun toStudentEntity(studentDto: NewStudent): Student

    fun toGroupDto(group: Group): GroupDto
    fun toGroupEntity(groupDto: GroupDto): Group
    companion object {
        val INSTANCE: StudentMapper = Mappers.getMapper(StudentMapper::class.java)
    }
}