package com.rfidreader.services.lecturers

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.models.Lecturer
import com.rfidreader.repositories.LecturerRepository
import com.rfidreader.services.lecturers.models.LecturerDto
import com.rfidreader.services.lecturers.models.LecturerMapper
import com.rfidreader.services.lecturers.models.NewLecturer
import jakarta.validation.Validator
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class LecturerServiceImpl(
    private val lecturerRepository : LecturerRepository,
    private val validator: Validator
): LecturerService {
    private val lecturerMapper = LecturerMapper.INSTANCE

    @Transactional
    override fun addLecturer(newLecturer: NewLecturer) {
        validator.validate(newLecturer).let {
            if(it.isNotEmpty()) throw ProcessException(it.first().message)
        }
        lecturerRepository.save(lecturerMapper.toLecturerEntity(newLecturer))
    }
    override fun deleteLecturer(id: Long) {
        val entity = lecturerRepository.findById(id).orElseThrow { ProcessException("Lecturer not found") }
        lecturerRepository.delete(entity)
    }
    override fun getAllLecturers(): List<LecturerDto> {
        return lecturerRepository.findAll().map { lecturerMapper.toLecturerDto(it) }
    }
}