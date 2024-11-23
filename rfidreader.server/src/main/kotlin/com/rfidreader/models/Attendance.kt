package com.rfidreader.models


import jakarta.persistence.*
import java.sql.Timestamp

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Attendances")
data class Attendance (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    val status: String,
    val time: Timestamp,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "discipline_id")
    val discipline: Discipline? = null
)