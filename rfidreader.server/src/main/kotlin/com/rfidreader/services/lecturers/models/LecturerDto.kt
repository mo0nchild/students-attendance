package com.rfidreader.services.lecturers.models

data class LecturerDto(
    val id: Long? = null,
    val name: String,
    val surname: String,
    val patronymic: String
)
data class NewLecturer(
    val name: String,
    val surname: String,
    val patronymic: String
)

