package com.rfidreader.controllers

import com.rfidreader.services.lecturers.LecturerService
import com.rfidreader.services.lecturers.models.LecturerDto
import com.rfidreader.services.lecturers.models.NewLecturer
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/lecturer")
class LecturerController(private val lecturerService: LecturerService) {
    @GetMapping("/getAll")
    fun getAllLecturers(): ResponseEntity<List<LecturerDto>> {
        return ResponseEntity.ok(lecturerService.getAllLecturers())
    }
    @PostMapping("/add")
    fun addLecturer(@RequestBody newLecturer: NewLecturer): ResponseEntity<String> {
        lecturerService.addLecturer(newLecturer)
        return ResponseEntity.ok("Lecturer successfully added")
    }
    @GetMapping("/remove/{id}")
    fun removeLecturer(@PathVariable id: Long): ResponseEntity<String> {
        lecturerService.deleteLecturer(id)
        return ResponseEntity.ok("Lecturer successfully removed")
    }
}