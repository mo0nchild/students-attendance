package com.rfidreader.repositories

import com.rfidreader.models.Attendance
import org.springframework.data.jpa.repository.JpaRepository

interface AttendanceRepository: JpaRepository<Attendance, Long> {
}