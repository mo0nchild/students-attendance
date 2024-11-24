package com.rfidreader.services.groups.models

import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull

data class GroupDto(
    val id: Long? = null,
    val name: String,
    val faculty: String,
)

data class NewGroup(
    @NotNull
    @NotEmpty
    val name: String,
    @NotNull
    @NotEmpty
    val faculty: String
)