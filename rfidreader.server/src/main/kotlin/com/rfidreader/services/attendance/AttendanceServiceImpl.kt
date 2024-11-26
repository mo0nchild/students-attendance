package com.rfidreader.services.attendance

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.repositories.AttendanceRepository
import com.rfidreader.services.attendance.models.AttendanceDto
import com.rfidreader.services.attendance.models.AttendanceMapper
import com.rfidreader.services.attendance.models.NewAttendances
import jakarta.validation.Validator
import org.springframework.transaction.annotation.Transactional

open class AttendanceServiceImpl(
    private val repository: AttendanceRepository,
    private val validator: Validator
) : AttendanceService {
    private val mapper = AttendanceMapper.INSTANCE

    @Transactional
    override fun addAttendances(attendances: NewAttendances) {
        validator.validate(attendances).let {
            if (it.isNotEmpty()) throw ProcessException(it.first().message)
        }
        val students =

    }
    override fun removeAttendance(rfidCode: String) {
        TODO("Not yet implemented")
    }
    override fun getAttendancesByLesson(lessonId: Long): List<AttendanceDto> {
        TODO("Not yet implemented")
    }
}