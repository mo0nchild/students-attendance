package com.rfidreader.models

import jakarta.persistence.*
import java.sql.Timestamp
import java.time.LocalDateTime

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Lessons")
data class Lesson (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    var time: LocalDateTime = LocalDateTime.now(),
    var theme: String,
) {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "discipline_id")
    var discipline: Discipline? = null

    @OneToMany(mappedBy = "lesson", cascade = [CascadeType.ALL], orphanRemoval = true)
    var attendances: MutableList<Attendance> = mutableListOf()

    @ManyToMany(mappedBy = "lessons", fetch = FetchType.EAGER)
    var groups: MutableList<Group> = mutableListOf()
}