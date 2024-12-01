package com.rfidreader.services.students.models

import com.rfidreader.services.groups.models.GroupDto
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class StudentDto(
    var id: Long? = null,
    val name: String,
    val surname: String,
    val patronymic: String,
    val rfidCode: String,
    val group: GroupDto
)

data class UpdateStudent(
    @field:NotNull
    val id: Long,

    @field:Size(min=3, max=50)
    @field:NotNull
    @field:NotEmpty
    val name: String,

    @field:Size(min=3, max=50)
    @field:NotNull
    @field:NotEmpty
    val surname: String,

    @field:Size(min=3, max=50)
    @field:NotNull
    @field:NotEmpty
    val patronymic: String,

    @field:NotNull
    val groupId: Long
)

data class NewStudent(
    @field:Size(min=3, max=50)
    @field:NotNull
    @field:NotEmpty
    val name: String,

    @field:Size(min=3, max=50)
    @field:NotNull
    @field:NotEmpty
    val surname: String,

    @field:Size(min =3, max=50)
    @field:NotNull
    @field:NotEmpty
    val patronymic: String,

    @field:NotNull
    @field:NotEmpty
    val rfidCode: String,
    @field:NotNull
    val groupId: Long
)
