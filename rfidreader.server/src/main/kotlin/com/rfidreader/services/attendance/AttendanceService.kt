package com.rfidreader.services.attendance

import com.rfidreader.services.attendance.models.AttendanceDto
import com.rfidreader.services.attendance.models.NewAttendances

interface AttendanceService {
    fun addAttendances(attendances: NewAttendances): Unit
    fun removeAttendance(rfidCode: String): Unit

    fun getAttendancesByLesson(lessonId: Long): List<AttendanceDto>
}