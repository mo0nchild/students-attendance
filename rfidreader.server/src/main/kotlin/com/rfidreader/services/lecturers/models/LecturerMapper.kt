package com.rfidreader.services.lecturers.models

import com.rfidreader.models.Lecturer
import com.rfidreader.services.groups.models.GroupMapper
import com.rfidreader.services.students.models.StudentMapper
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingConstants
import org.mapstruct.Mappings
import org.mapstruct.NullValueMappingStrategy
import org.mapstruct.ReportingPolicy
import org.mapstruct.factory.Mappers

@Mapper(
    componentModel = MappingConstants.ComponentModel.DEFAULT,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT,
)
interface LecturerMapper {
    @Mappings(
        Mapping(target = "id", ignore = true)
    )
    fun toLecturerEntity(lecturerDto: NewLecturer): Lecturer
    @Mappings(
        Mapping(target = "id", source = "id")
    )
    fun toLecturerDto(lecturer: Lecturer): LecturerDto

    companion object {
        val INSTANCE: LecturerMapper = Mappers.getMapper(LecturerMapper::class.java)
    }
}