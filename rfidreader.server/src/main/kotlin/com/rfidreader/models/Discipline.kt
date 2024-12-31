package com.rfidreader.models

import jakarta.persistence.*

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Disciplines")
data class Discipline (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    var name: String,
) {
    @OneToMany(mappedBy = "discipline", cascade = [CascadeType.ALL], orphanRemoval = true)
    var lessons: MutableList<Lesson> = mutableListOf()
}