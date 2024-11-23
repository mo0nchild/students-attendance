package com.rfidreader.models

import jakarta.persistence.*

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Lecturers")
data class Lecturer (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id : Long,
    val name: String,
    val surname: String,
    val patronymic: String,

    @OneToMany(mappedBy = "lecturer", cascade = [CascadeType.ALL], orphanRemoval = true)
    val disciplines: MutableList<Discipline> = mutableListOf(),
)