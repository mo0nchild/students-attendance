package com.rfidreader.models

import jakarta.persistence.*
import java.sql.Timestamp

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Lessons")
data class LessonGroup (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "attendance_id", nullable = false)
    val attendances: MutableList<Attendance> = mutableListOf(),

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    val groups: MutableList<Group> = mutableListOf()
)