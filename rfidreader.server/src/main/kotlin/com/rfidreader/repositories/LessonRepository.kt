package com.rfidreader.repositories

import com.rfidreader.models.Lesson
import org.springframework.data.jpa.repository.JpaRepository

interface LessonRepository: JpaRepository<Lesson, Long> {
}