package com.rfidreader.services.lessons.models

import com.fasterxml.jackson.annotation.JsonFormat
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
    @field:JsonFormat(pattern="yyyy-MM-dd'T'HH:mm")
    val time: LocalDateTime? = null,
    val discipline: DisciplineDto? = null,
    val groups: List<GroupDto> = listOf(),
)
data class StudentOnLesson(
    val student: StudentDto,
    @field:JsonFormat(pattern="yyyy-MM-dd'T'HH:mm")
    val time: LocalDateTime? = null,
)
data class UpdateLesson(
    @field:NotNull
    val id: Long,

    @field:Size(min = 3, max = 100)
    @field:NotNull
    @field:NotEmpty
    val theme: String,

    @field:NotNull
    val time: LocalDateTime,

    @field:NotNull
    val disciplineId: Long,

    @field:NotNull
    @field:NotEmpty
    val groupIds: List<Long> = listOf(),
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
data class LessonStudentInfo(
    @field:JsonFormat(pattern="yyyy-MM-dd'T'HH:mm")
    val time: LocalDateTime,
    val students: List<StudentOnLesson>
)
data class GroupAttendancesOnLesson(
    val group: GroupDto,
    val lessons: List<LessonStudentInfo>
)