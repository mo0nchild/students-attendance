package com.rfidreader.services.lecturers.models

import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class LecturerDto(
    val id: Long? = null,
    val name: String,
    val surname: String,
    val patronymic: String
)
data class UpdateLecturer(
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
    val patronymic: String
)
data class NewLecturer(
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
    val patronymic: String
)

