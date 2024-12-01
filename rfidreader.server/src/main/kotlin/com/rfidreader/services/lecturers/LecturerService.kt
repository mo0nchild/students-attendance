package com.rfidreader.services.lecturers

import com.rfidreader.models.Lecturer
import com.rfidreader.services.lecturers.models.LecturerDto
import com.rfidreader.services.lecturers.models.NewLecturer
import com.rfidreader.services.lecturers.models.UpdateLecturer

interface LecturerService {
    fun addLecturer(newLecturer: NewLecturer): Unit
    fun deleteLecturer(id: Long): Unit

    fun updateLecturer(lecturer: UpdateLecturer): Unit
    fun getAllLecturers(): List<LecturerDto>
}