package com.rfidreader.repositories

import com.rfidreader.models.Attendance
import com.rfidreader.services.attendance.models.AttendanceDto
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AttendanceRepository: JpaRepository<Attendance, Long> {
    @Query("SELECT a FROM Attendance a WHERE a.lesson.id = :lessonId")
    fun getAttendanceByLesson(@Param("lessonId") lessonId: Long): List<Attendance>
}