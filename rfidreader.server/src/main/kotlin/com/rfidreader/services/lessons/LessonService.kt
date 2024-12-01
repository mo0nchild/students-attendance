package com.rfidreader.services.lessons

import com.rfidreader.services.lessons.models.LessonDto
import com.rfidreader.services.lessons.models.NewLesson
import com.rfidreader.services.lessons.models.StudentOnLesson
import com.rfidreader.services.lessons.models.UpdateLesson
import com.rfidreader.services.students.models.StudentDto

interface LessonService {
    fun addLesson(newLesson: NewLesson): Unit
    fun deleteLesson(id: Long): Unit
    fun updateLesson(lesson: UpdateLesson): Unit

    fun getLessonsByDiscipline(id: Long): List<LessonDto>
    fun getStudentsOnLesson(lessonId: Long): List<StudentOnLesson>
}