package com.rfidreader.infrastructures.repositories

import com.rfidreader.models.Lecturer
import org.springframework.data.jpa.repository.JpaRepository

interface LecturerRepository: JpaRepository<Lecturer, Long> {
}