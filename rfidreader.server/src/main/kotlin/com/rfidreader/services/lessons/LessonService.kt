package com.rfidreader.services.lessons

import com.rfidreader.services.lessons.models.LessonDto
import com.rfidreader.services.lessons.models.NewLesson

interface LessonService {
    fun addLesson(newLesson: NewLesson): Unit
    fun deleteLesson(id: Long): Unit

    fun getLessonsByDiscipline(id: Long): List<LessonDto>
}