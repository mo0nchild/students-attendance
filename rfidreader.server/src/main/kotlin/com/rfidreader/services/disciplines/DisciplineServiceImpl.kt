package com.rfidreader.services.disciplines

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.infrastructures.repositories.DisciplineRepository
import com.rfidreader.services.disciplines.models.DisciplineDto
import com.rfidreader.services.disciplines.models.DisciplineMapper
import com.rfidreader.services.disciplines.models.NewDiscipline
import com.rfidreader.services.disciplines.models.UpdateDiscipline
import jakarta.validation.Validator
import org.springframework.beans.factory.annotation.Autowired
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
        repository.getDisciplinesByName(newDiscipline.name).let {
            if(it.isNotEmpty()) throw ProcessException("Discipline already exists")
        }
        val entity = mapper.toDisciplineEntity(newDiscipline)
        repository.saveWithLecture(entity)
    }
    @Transactional
    override fun removeDiscipline(id: Long) {
        val entity = repository.findById(id).orElseThrow { ProcessException("Discipline not found") }
        repository.delete(entity)
    }
    @Transactional
    override fun updateDiscipline(discipline: UpdateDiscipline) {
        validator.validate(discipline).let {
            if(it.isNotEmpty()) throw ProcessException(it.first().message)
        }
        val entity = repository.findById(discipline.id).orElseThrow { ProcessException("Discipline not found") }
            .also {
                it.name = discipline.name
            }
        repository.save(entity)
    }

    override fun getAllDisciplines(): List<DisciplineDto> {
        return repository.findAll().map { mapper.toDisciplineDto(it) }
    }
}