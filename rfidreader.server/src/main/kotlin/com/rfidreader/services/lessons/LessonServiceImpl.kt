package com.rfidreader.services.lessons

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.infrastructures.repositories.DisciplineRepository
import com.rfidreader.infrastructures.repositories.GroupRepository
import com.rfidreader.infrastructures.repositories.LessonRepository
import com.rfidreader.infrastructures.repositories.customs.LessonCustomRepository
import com.rfidreader.services.groups.models.GroupMapper
import com.rfidreader.services.lessons.models.GroupAttendancesOnLesson
import com.rfidreader.services.lessons.models.LessonDto

import com.rfidreader.services.lessons.models.LessonMapper
import com.rfidreader.services.lessons.models.LessonStudentInfo
import com.rfidreader.services.lessons.models.NewLesson
import com.rfidreader.services.lessons.models.StudentOnLesson
import com.rfidreader.services.lessons.models.UpdateLesson
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
    private val groupMapper = GroupMapper.INSTANCE
    @Autowired
    private lateinit var studentService: StudentService
    @Autowired
    private lateinit var groupRepository: GroupRepository
    @Autowired
    private lateinit var disciplineRepository: DisciplineRepository
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
        lessonRepository.deleteById(entity.id!!)
    }
    @Transactional
    override fun updateLesson(lesson: UpdateLesson) {
        validator.validate(lesson).let {
            if (it.isNotEmpty()) throw ProcessException(it.first().message)
        }
        val entity = lessonRepository.findById(lesson.id).orElseThrow { ProcessException("Lesson not found") }
            .also {
                it.time = lesson.time
                it.theme = lesson.theme
                it.discipline = disciplineRepository.findById(lesson.disciplineId)
                    .orElseThrow { ProcessException("Discipline not found") }
            }
        entity.groups.forEach { it.lessons.remove(entity) }
        lesson.groupIds.forEach {
            val group = groupRepository.findById(it).orElseThrow { ProcessException("Group id=$it not found") }
                .let { it.lessons.add(entity); it }
            groupRepository.save(group)

        }
        lessonRepository.save(entity)
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
    override fun getLessonsByGroupId(groupId: Long, disciplineId: Long): GroupAttendancesOnLesson {
        val group = groupRepository.findById(groupId).orElseThrow { ProcessException("Group id=$groupId not found") }
        val discipline = disciplineRepository.findById(disciplineId).orElseThrow { ProcessException("Discipline not found") }

        val students = mutableListOf<LessonStudentInfo>()
        discipline.lessons.forEach {
            val attendances = getStudentsOnLesson(it.id!!).filter { it.student.group.id == groupId }.toList()
            if (attendances.isEmpty()) return@forEach
            students.add(LessonStudentInfo(
                time = it.time,
                students = attendances
            ))
        }
        return GroupAttendancesOnLesson(groupMapper.toGroupDto(group), students)
    }
}