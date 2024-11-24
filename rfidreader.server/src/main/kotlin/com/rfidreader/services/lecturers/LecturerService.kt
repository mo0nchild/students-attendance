package com.rfidreader.services.lecturers

import com.rfidreader.models.Lecturer
import com.rfidreader.services.lecturers.models.LecturerDto
import com.rfidreader.services.lecturers.models.NewLecturer

interface LecturerService {
    fun addLecturer(newLecturer: NewLecturer): Unit
    fun deleteLecturer(id: Long): Unit

    fun getAllLecturers(): List<LecturerDto>
}