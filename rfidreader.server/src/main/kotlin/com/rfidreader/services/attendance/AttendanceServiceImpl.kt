package com.rfidreader.services.attendance

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.models.Attendance
import com.rfidreader.repositories.AttendanceRepository
import com.rfidreader.repositories.LessonRepository
import com.rfidreader.repositories.StudentRepository
import com.rfidreader.services.attendance.models.AttendanceDto
import com.rfidreader.services.attendance.models.AttendanceMapper
import com.rfidreader.services.attendance.models.NewAttendances
import jakarta.validation.Validator
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.sql.Timestamp
import java.time.LocalDateTime

@Service
open class AttendanceServiceImpl(
    private val attendanceRepository: AttendanceRepository,
    private val validator: Validator
) : AttendanceService {
    private val mapper = AttendanceMapper.INSTANCE

    @Autowired
    private lateinit var studentRepository: StudentRepository
    @Autowired
    private lateinit var lessonRepository: LessonRepository

    @Transactional
    override fun addAttendances(attendances: NewAttendances) {
        validator.validate(attendances).let {
            if (it.isNotEmpty()) throw ProcessException(it.first().message)
        }
        val newAttendances: MutableList<Attendance> = mutableListOf()
        val lesson = lessonRepository.findById(attendances.lessonId).let {
            if (it.isPresent) it.get() else throw ProcessException("Lesson not found")
        }
        for (item in attendances.rfidCodes) {
            if(attendanceRepository.checkExists(item.code, lesson.id!!).isPresent) continue
            studentRepository.getStudentsByRfidCode(item.code).forEach {
                newAttendances.add(Attendance(time = item.time).apply {
                    this.lesson = lesson
                    this.student = it
                })
            }
        }
        attendanceRepository.saveAll(newAttendances)
    }
    @Transactional
    override fun removeAttendance(rfidCode: String, lessonId: Long) {
        attendanceRepository.deleteAll(attendanceRepository.getAttendanceByLesson(lessonId).filter {
            it.student?.rfidCode == rfidCode
        }.let {
            it.ifEmpty { throw ProcessException("Not found") }
        })
    }
    @Transactional
    override fun removeAllAttendance(lessonId: Long) {
        attendanceRepository.deleteAll(attendanceRepository.getAttendanceByLesson(lessonId).let {
            it.ifEmpty { throw ProcessException("Not found") }
        })
    }
    override fun getAttendancesByLesson(lessonId: Long): List<AttendanceDto> {
        return attendanceRepository.getAttendanceByLesson(lessonId).map { mapper.toAttendanceDto(it) }
    }
}