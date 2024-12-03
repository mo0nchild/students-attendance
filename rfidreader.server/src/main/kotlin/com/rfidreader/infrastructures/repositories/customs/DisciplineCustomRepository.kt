package com.rfidreader.infrastructures.repositories.customs

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.models.Discipline
import com.rfidreader.models.Lecturer
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

interface DisciplineCustomRepository {
    fun saveWithLecture(discipline: Discipline, lecturerId: Long)
}

@Repository
open class DisciplineRepositoryImpl : DisciplineCustomRepository {
    @PersistenceContext
    private lateinit var entityManager: EntityManager
    @Transactional
    override fun saveWithLecture(discipline: Discipline, lecturerId: Long) {
        if(discipline.lecturer == null) {
            discipline.lecturer = entityManager.find(Lecturer::class.java, lecturerId)
                ?: throw ProcessException("Lecturer not found")
        }
        entityManager.persist(discipline)
        entityManager.flush()
    }
}