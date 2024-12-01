package com.rfidreader.services.groups.models

import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class GroupDto(
    val id: Long? = null,
    val name: String,
    val faculty: String,
)
data class UpdateGroup(
    val id: Long,

    @Size(min = 3, max = 100)
    @NotNull
    @NotEmpty
    val name: String,

    @Size(min = 3, max = 100)
    @NotNull
    @NotEmpty
    val faculty: String,
)
data class NewGroup(
    @Size(min = 3, max = 100)
    @NotNull
    @NotEmpty
    val name: String,

    @Size(min = 3, max = 100)
    @NotNull
    @NotEmpty
    val faculty: String
)