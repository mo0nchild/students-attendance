package com.rfidreader.services.lessons.models

import com.fasterxml.jackson.annotation.JsonFormat
import com.rfidreader.services.attendance.models.AttendanceDto
import com.rfidreader.services.disciplines.models.DisciplineDto
import com.rfidreader.services.groups.models.GroupDto
import com.rfidreader.services.students.models.StudentDto
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

data class LessonDto(
    val id: Long? = null,
    val theme: String,
    val time: LocalDateTime? = null,
    val discipline: DisciplineDto? = null,
    val groups: List<GroupDto> = listOf(),
)
data class StudentOnLesson(
    val student: StudentDto,
    val time: LocalDateTime? = null,
)

class NewLesson (
    @field:Size(min = 3, max = 100)
    @field:NotNull
    @field:NotEmpty
    val theme: String,

    @field:NotNull
    val disciplineId: Long,

    @field:NotNull
    val time: LocalDateTime,

    @field:NotNull
    @field:NotEmpty
    val groups: List<Long> = listOf()
)