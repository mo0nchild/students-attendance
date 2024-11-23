package com.rfidreader.models

import jakarta.persistence.*
import java.sql.Timestamp

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Lessons")
data class Lesson (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val time: Timestamp,
    val theme: String,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "discipline_id")
    val discipline: Discipline? = null,

    @OneToMany(mappedBy = "lesson", cascade = [CascadeType.ALL], orphanRemoval = true)
    val attendances: MutableList<Attendance> = mutableListOf(),

    @ManyToMany(mappedBy = "lessons", cascade = [CascadeType.ALL])
    val groups: MutableList<Group> = mutableListOf()
)