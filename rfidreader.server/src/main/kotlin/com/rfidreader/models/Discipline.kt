package com.rfidreader.models

import jakarta.persistence.*

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Disciplines")
data class Discipline (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    val name: String,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lecturer_id")
    val lecturer: Lecturer? = null,

    @OneToMany(mappedBy = "discipline", cascade = [CascadeType.ALL], orphanRemoval = true)
    val lessons: MutableList<Lesson> = mutableListOf()
)