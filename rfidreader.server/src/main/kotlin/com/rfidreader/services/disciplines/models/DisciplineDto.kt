package com.rfidreader.services.disciplines.models

import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class DisciplineDto(
    val id: Long? = null,
    val name: String
)
data class UpdateDiscipline(
    @field:NotNull
    val id: Long,

    @field:Size(min = 3, max = 100)
    @field:NotNull
    @field:NotEmpty
    val name: String,

    @field:NotNull
    val lecturerId: Long
)
data class NewDiscipline(
    @field:Size(min = 3, max = 100)
    @field:NotNull
    @field:NotEmpty
    val name: String,

    @field:NotNull
    val lecturerId: Long
)