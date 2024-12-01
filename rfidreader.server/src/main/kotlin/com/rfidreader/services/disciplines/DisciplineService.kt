package com.rfidreader.services.disciplines

import com.rfidreader.services.disciplines.models.DisciplineDto
import com.rfidreader.services.disciplines.models.NewDiscipline
import com.rfidreader.services.disciplines.models.UpdateDiscipline
import org.springframework.stereotype.Service

interface DisciplineService {
    fun addDiscipline(newDiscipline: NewDiscipline): Unit
    fun removeDiscipline(id: Long): Unit
    fun updateDiscipline(discipline: UpdateDiscipline): Unit

    fun getAllDisciplines(): List<DisciplineDto>
    fun getDisciplineByLecturer(id: Long): List<DisciplineDto>
}