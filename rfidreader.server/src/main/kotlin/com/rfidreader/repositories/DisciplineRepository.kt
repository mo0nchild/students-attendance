package com.rfidreader.repositories

import com.rfidreader.models.Discipline
import org.springframework.data.jpa.repository.JpaRepository

interface DisciplineRepository: JpaRepository<Discipline, Long> {
}