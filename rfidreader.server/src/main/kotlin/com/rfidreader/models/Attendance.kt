package com.rfidreader.models


import jakarta.persistence.*
import java.sql.Timestamp
import java.time.LocalDateTime

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Attendances")
data class Attendance (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val time: LocalDateTime = LocalDateTime.now(),
) {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id")
    var student: Student? = null

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id")
    var lesson: Lesson? = null
}