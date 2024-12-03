package com.rfidreader.infrastructures.repositories.customs

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.models.Group
import com.rfidreader.models.Student
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

interface StudentCustomRepository {
    fun saveWithGroup(user: Student, groupId: Long)
}

@Repository
open class StudentCustomRepositoryImpl : StudentCustomRepository {
    @PersistenceContext
    private lateinit var entityManager: EntityManager

    @Transactional
    override fun saveWithGroup(user: Student, groupId: Long) {
        if(user.group == null) {
            user.group = entityManager.find(Group::class.java, groupId) ?: throw ProcessException("Group not found")
        }
        entityManager.persist(user)
        entityManager.flush()
    }
}