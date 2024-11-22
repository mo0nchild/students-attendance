package com.rfidreader.services.students.models

import com.rfidreader.models.Student
import org.mapstruct.Mapper
import org.mapstruct.factory.Mappers

data class StudentDto(
    var id: Long,
    val name: String,
    val surname: String,
    val patronymic: String,
    val rfidCode: String,
    val group: GroupDto
)

data class NewStudent(
    val name: String,
    val surname: String,
    val patronymic: String,
    val rfidCode: String,
    val groupId: Long
)
