package com.rfidreader.services.students.mappers

import com.rfidreader.models.Group
import com.rfidreader.models.Student
import com.rfidreader.services.students.models.GroupDto
import com.rfidreader.services.students.models.NewStudent
import com.rfidreader.services.students.models.StudentDto
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingConstants
import org.mapstruct.Mappings
import org.mapstruct.ReportingPolicy
import org.mapstruct.factory.Mappers

@Mapper(
    componentModel = MappingConstants.ComponentModel.DEFAULT,
    uses = [GroupMapper::class],
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
interface StudentMapper {
    @Mappings(
        Mapping(target = "id", source = "id"),
        Mapping(target = "group", source = "group"),
    )
    fun toStudentDto(student: Student): StudentDto
    fun toStudentEntity(studentDto: NewStudent): Student

    companion object {
        val INSTANCE: StudentMapper = Mappers.getMapper(StudentMapper::class.java)
    }
}