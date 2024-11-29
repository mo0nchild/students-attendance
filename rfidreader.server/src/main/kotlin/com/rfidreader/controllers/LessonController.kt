package com.rfidreader.controllers

import com.rfidreader.services.lessons.LessonService
import com.rfidreader.services.lessons.models.LessonDto
import com.rfidreader.services.lessons.models.NewLesson
import com.rfidreader.services.lessons.models.StudentOnLesson
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/lesson")
class LessonController(private val lessonService: LessonService) {
    @GetMapping("/getAll/discipline/{id}")
    fun getLessonsByDiscipline(@PathVariable("id") id: Long): ResponseEntity<List<LessonDto>> {
        return ResponseEntity.ok(lessonService.getLessonsByDiscipline(id))
    }
    @PostMapping("/add")
    fun addLesson(@RequestBody newLesson: NewLesson): ResponseEntity<String> {
        lessonService.addLesson(newLesson)
        return ResponseEntity.ok("Lesson successfully added")
    }
    @DeleteMapping("/remove/{id}")
    fun removeLesson(@PathVariable("id") id: Long): ResponseEntity<String> {
        lessonService.deleteLesson(id)
        return ResponseEntity.ok("Lesson successfully removed")
    }
    @GetMapping("/getInfo/{id}")
    fun getStudentsOnLesson(@PathVariable("id") id: Long): ResponseEntity<List<StudentOnLesson>> {
        return ResponseEntity.ok(lessonService.getStudentsOnLesson(id))
    }
}