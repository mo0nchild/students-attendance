package com.rfidreader.models

import jakarta.persistence.*

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Lecturers")
data class Lecturer (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    var name: String,
    var surname: String,
    var patronymic: String
) {
    @OneToMany(mappedBy = "lecturer", cascade = [CascadeType.ALL], orphanRemoval = true)
    var disciplines: MutableList<Discipline> = mutableListOf()
}