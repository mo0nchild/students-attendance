package com.rfidreader.services.disciplines

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.repositories.DisciplineRepository
import com.rfidreader.services.disciplines.models.DisciplineDto
import com.rfidreader.services.disciplines.models.DisciplineMapper
import com.rfidreader.services.disciplines.models.NewDiscipline
import jakarta.validation.Validator
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DisciplineServiceImpl(
    private val repository: DisciplineRepository,
    private val validator: Validator
) : DisciplineService {
    private val mapper = DisciplineMapper.INSTANCE

    @Transactional
    override fun addDiscipline(newDiscipline: NewDiscipline) {
        validator.validate(newDiscipline).let {
            if(it.isNotEmpty()) throw ProcessException(it.first().message)
        }
        val entity = mapper.toDisciplineEntity(newDiscipline)
        repository.saveWithLecture(entity, newDiscipline.lecturerId)
    }
    override fun removeDiscipline(id: Long) {
        val entity = repository.findById(id).orElseThrow { ProcessException("Group not found") }
        repository.delete(entity)
    }
    override fun getAllDisciplines(): List<DisciplineDto> {
        return repository.findAll().map { mapper.toDisciplineDto(it) }
    }
    override fun getDisciplineByLecturer(id: Long): List<DisciplineDto> {
        return repository.getDisciplinesByLecturer(id).map { mapper.toDisciplineDto(it) }
    }
}