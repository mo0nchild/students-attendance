package com.rfidreader.repositories

import com.rfidreader.models.Discipline
import com.rfidreader.models.Lecturer
import com.rfidreader.repositories.customs.DisciplineCustomRepository
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface DisciplineRepository: JpaRepository<Discipline, Long>, DisciplineCustomRepository {
    @Query("Select u From Discipline u Where u.lecturer.id = :lecturerId")
    fun getDisciplinesByLecturer(lecturerId: Long): List<Discipline>
}