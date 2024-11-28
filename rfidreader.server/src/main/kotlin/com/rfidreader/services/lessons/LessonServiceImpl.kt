package com.rfidreader.services.lessons

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.repositories.LessonRepository
import com.rfidreader.repositories.customs.LessonCustomRepository
import com.rfidreader.services.lessons.models.LessonDto
import com.rfidreader.services.lessons.models.LessonMapper
import com.rfidreader.services.lessons.models.NewLesson
import jakarta.validation.Validator
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
open class LessonServiceImpl(
    private val lessonRepository: LessonRepository,
    private val validator: Validator
) : LessonService {
    private val mapper = LessonMapper.INSTANCE
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
}