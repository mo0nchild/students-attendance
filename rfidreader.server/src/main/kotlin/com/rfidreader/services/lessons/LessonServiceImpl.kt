package com.rfidreader.services.lessons

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.repositories.AttendanceRepository
import com.rfidreader.repositories.LessonRepository
import com.rfidreader.repositories.customs.LessonCustomRepository
import com.rfidreader.services.attendance.AttendanceService
import com.rfidreader.services.lessons.models.LessonDto

import com.rfidreader.services.lessons.models.LessonMapper
import com.rfidreader.services.lessons.models.NewLesson
import com.rfidreader.services.lessons.models.StudentOnLesson
import com.rfidreader.services.students.StudentService
import com.rfidreader.services.students.models.StudentMapper
import jakarta.validation.Validator
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
open class LessonServiceImpl(
    private val lessonRepository: LessonRepository,
    private val validator: Validator
) : LessonService {
    private val mapper = LessonMapper.INSTANCE
    @Autowired
    private lateinit var studentService: StudentService

    @Transactional
    override fun addLesson(newLesson: NewLesson) {
        validator.validate(newLesson).let {
            if (it.isNotEmpty()) throw ProcessException(it.first().message)
        }
        lessonRepository.saveLessonWithGroupsAndDiscipline(with(newLesson) {
            LessonCustomRepository.SaveLessonInfo(
                lesson = mapper.toLessonEntity(this@with),
                groupIds = groups,
                disciplineId = disciplineId
            )
        })
    }
    @Transactional
    override fun deleteLesson(id: Long) {
        val entity = lessonRepository.findById(id).orElseThrow { ProcessException("Lesson not found") }
        lessonRepository.delete(entity)
    }
    override fun getLessonsByDiscipline(id: Long): List<LessonDto> {
        return lessonRepository.getLessonsByDiscipline(id).map { mapper.toLessonDto(it) }
    }
    override fun getStudentsOnLesson(lessonId: Long): List<StudentOnLesson> {
        val lesson = lessonRepository.findById(lessonId).let {
            if(it.isPresent) it.get() else return listOf()
        }
        val students = lesson.attendances.map {
            StudentOnLesson(StudentMapper.INSTANCE.toStudentDto(it.student!!), time = it.time)
        }.toMutableList()
        lesson.groups.forEach {
            val studentsInGroup = studentService.getStudentsByGroupId(it.id!!)
                .filter { student -> students.all { item -> item.student.id != student.id } }
                .map { StudentOnLesson(it, time = null) }
            students.addAll(studentsInGroup)
        }
        return students
    }
}