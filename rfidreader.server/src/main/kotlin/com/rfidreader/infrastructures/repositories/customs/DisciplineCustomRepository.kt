package com.rfidreader.infrastructures.repositories.customs

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.models.Discipline
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

interface DisciplineCustomRepository {
    fun saveWithLecture(discipline: Discipline)
}

@Repository
open class DisciplineRepositoryImpl : DisciplineCustomRepository {
    @PersistenceContext
    private lateinit var entityManager: EntityManager
    @Transactional
    override fun saveWithLecture(discipline: Discipline) {
        entityManager.persist(discipline)
        entityManager.flush()
    }
}