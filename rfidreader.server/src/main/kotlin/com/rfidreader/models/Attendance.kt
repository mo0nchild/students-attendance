package com.rfidreader.models


import jakarta.persistence.*
import java.sql.Timestamp

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Attendances")
data class Attendance (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val time: Timestamp,
) {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id")
    var student: Student? = null

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id")
    var lesson: Lesson? = null
}