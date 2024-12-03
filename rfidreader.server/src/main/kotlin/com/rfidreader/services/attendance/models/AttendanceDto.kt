package com.rfidreader.services.attendance.models

import com.fasterxml.jackson.annotation.JsonFormat
import com.rfidreader.services.students.models.StudentDto
import jakarta.validation.Valid
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

data class AttendanceDto(
    var id: Long? = null,
    @field:JsonFormat(pattern="yyyy-MM-dd'T'HH:mm")
    val time: LocalDateTime,
    val student: StudentDto,
)

data class NewAttendances(
    @field:NotNull
    @field:NotEmpty
    @field:Valid
    val rfidCodes: List<AttendanceInfo>,
    @field:NotNull
    val lessonId: Long
)
data class AttendanceInfo(
    @field:NotNull
    @field:NotEmpty
    val code: String,

    @field:NotNull
    val time: LocalDateTime,
)