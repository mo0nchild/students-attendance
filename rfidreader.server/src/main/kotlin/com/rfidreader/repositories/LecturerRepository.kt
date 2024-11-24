package com.rfidreader.repositories

import com.rfidreader.models.Lecturer
import org.springframework.data.jpa.repository.JpaRepository

interface LecturerRepository: JpaRepository<Lecturer, Long> {
}