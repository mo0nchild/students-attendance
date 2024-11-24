package com.rfidreader.services.students.models

import com.rfidreader.models.Attendance
import com.rfidreader.models.Student
import com.rfidreader.services.groups.models.GroupMapper
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingConstants
import org.mapstruct.Mappings
import org.mapstruct.Named
import org.mapstruct.NullValueMappingStrategy
import org.mapstruct.NullValuePropertyMappingStrategy
import org.mapstruct.ReportingPolicy
import org.mapstruct.factory.Mappers

@Mapper(
    componentModel = MappingConstants.ComponentModel.DEFAULT,
    uses = [GroupMapper::class],
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT,
)
interface StudentMapper {
    @Mappings(
        Mapping(target = "id", source = "id"),
        Mapping(target = "group", source = "group"),
    )
    fun toStudentDto(student: Student): StudentDto
    @Mappings(
        Mapping(target = "id", ignore = true),
        Mapping(source = "groupId", target = "attendances", ignore = true),
    )
    fun toStudentEntity(studentDto: NewStudent): Student

    companion object {
        val INSTANCE: StudentMapper = Mappers.getMapper(StudentMapper::class.java)
    }
}