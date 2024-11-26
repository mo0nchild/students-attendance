package com.rfidreader.services.attendance.models

import com.rfidreader.models.Attendance
import com.rfidreader.services.students.models.StudentMapper
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingConstants
import org.mapstruct.Mappings
import org.mapstruct.ReportingPolicy
import org.mapstruct.factory.Mappers

@Mapper(
    componentModel = MappingConstants.ComponentModel.DEFAULT,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = [StudentMapper::class],
)
interface AttendanceMapper {
    @Mappings(
        Mapping(target = "id", source = "id")
    )
    fun toAttendanceDto(attendance: Attendance): AttendanceDto
    companion object {
        val INSTANCE: AttendanceMapper = Mappers.getMapper(AttendanceMapper::class.java)
    }
}