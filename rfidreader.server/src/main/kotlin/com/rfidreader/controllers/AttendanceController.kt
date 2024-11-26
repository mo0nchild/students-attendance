package com.rfidreader.controllers

import com.rfidreader.services.attendance.AttendanceService
import com.rfidreader.services.attendance.models.AttendanceDto
import com.rfidreader.services.attendance.models.NewAttendances
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("api/attendance")
class AttendanceController(private val attendanceService: AttendanceService) {
    @GetMapping("/getAll/lesson/{id}")
    fun getAllAttendance(@PathVariable id: Long): ResponseEntity<List<AttendanceDto>> {
        return ResponseEntity.ok(attendanceService.getAttendancesByLesson(id))
    }
    @PostMapping("/add")
    fun addAttendances(@RequestBody attendances: NewAttendances): ResponseEntity<String> {
        attendanceService.addAttendances(attendances)
        return ResponseEntity.ok("Attendance successfully added")
    }
    @DeleteMapping("/remove/{rfid}/{lessonId}")
    fun removeAttendance(@PathVariable rfid: String, @PathVariable lessonId: Long): ResponseEntity<String> {
        attendanceService.removeAttendance(rfid, lessonId)
        return ResponseEntity.ok("Attendance successfully removed")
    }

}