package com.rfidreader.infrastructures.repositories

import com.rfidreader.infrastructures.repositories.customs.DisciplineCustomRepository
import com.rfidreader.models.Discipline
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface DisciplineRepository: JpaRepository<Discipline, Long>, DisciplineCustomRepository {
    @Query("Select u From Discipline u Where u.lecturer.id = :lecturerId")
    fun getDisciplinesByLecturer(lecturerId: Long): List<Discipline>

    @Query("SELECT u FROM Discipline u WHERE u.name = :name")
    fun getDisciplinesByName(name: String): List<Discipline>
}