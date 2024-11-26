package com.rfidreader.services.attendance.models

import com.rfidreader.services.students.models.StudentDto
import java.time.LocalDateTime

data class AttendanceDto(
    var id: Long? = null,
    val time: LocalDateTime,
    val student: StudentDto,
)

data class NewAttendances(
    val rfidCodes: List<String>,
    val lessonId: Long
)