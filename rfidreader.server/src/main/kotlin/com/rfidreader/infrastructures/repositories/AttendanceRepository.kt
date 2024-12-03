package com.rfidreader.infrastructures.repositories

import com.rfidreader.models.Attendance
import com.rfidreader.services.attendance.models.AttendanceDto
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.Optional

interface AttendanceRepository: JpaRepository<Attendance, Long> {
    @Query("SELECT a FROM Attendance a WHERE a.lesson.id = :lessonId")
    fun getAttendanceByLesson(@Param("lessonId") lessonId: Long): List<Attendance>

    @Query("SELECT a FROM Attendance a WHERE a.student.rfidCode = :rfidCode AND a.lesson.id = :lessonId")
    fun checkExists(@Param("rfidCode") rfidCode: String, @Param("lessonId") lessonId: Long): Optional<Attendance>
}