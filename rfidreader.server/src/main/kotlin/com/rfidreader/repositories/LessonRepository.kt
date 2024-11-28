package com.rfidreader.repositories

import com.rfidreader.models.Lesson
import com.rfidreader.repositories.customs.LessonCustomRepository
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface LessonRepository: JpaRepository<Lesson, Long>, LessonCustomRepository {
    @Query("SELECT l FROM Lesson l WHERE l.discipline.id = :lessonId")
    fun getLessonsByDiscipline(@Param("lessonId") lessonId: Long): List<Lesson>
}