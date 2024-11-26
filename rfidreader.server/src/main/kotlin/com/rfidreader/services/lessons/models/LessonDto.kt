package com.rfidreader.services.lessons.models

import com.rfidreader.services.attendance.models.AttendanceDto
import com.rfidreader.services.groups.models.GroupDto
import java.time.LocalDateTime

data class LessonDto(
    val id: Long? = null,
    val theme: String,
    val time: LocalDateTime? = null,
    val groups: List<GroupDto> = listOf(),
    val attendances: List<AttendanceDto> = listOf(),
)