package com.rfidreader.models

import jakarta.persistence.*

@Suppress("JpaObjectClassSignatureInspection")
@Entity
data class Lecturer (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val Id : Long,
    val Name: String,
    val Surname: String,
    val Patronymic: String,
)