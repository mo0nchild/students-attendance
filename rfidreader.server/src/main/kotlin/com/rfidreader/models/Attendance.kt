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
    val time: Timestamp,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "discipline_id")
    val discipline: Discipline? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id")
    val lesson: Lesson? = null,

    @ManyToMany(mappedBy = "attendance_id", cascade = [CascadeType.ALL])
    val lessonGroups: MutableList<LessonGroup> = mutableListOf()
)