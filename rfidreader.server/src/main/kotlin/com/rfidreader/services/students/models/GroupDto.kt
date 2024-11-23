package com.rfidreader.services.students.models

data class GroupDto(
    val id: Long? = null,
    val name: String,
    val faculty: String,
)

data class NewGroup(
    val name: String,
    val faculty: String
)