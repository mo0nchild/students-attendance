package com.rfidreader.models


import jakarta.persistence.*
import java.sql.Timestamp

@Suppress("JpaObjectClassSignatureInspection")
@Entity
data class Attendance (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val Id: Long,
    val status: String,
    val time: Timestamp
)