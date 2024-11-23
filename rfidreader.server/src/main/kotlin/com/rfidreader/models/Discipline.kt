package com.rfidreader.models

import jakarta.persistence.*

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Disciplines")
data class Discipline (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val name: String,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lecturer_id")
    val lecturer: Lecturer? = null,
)