package com.rfidreader.repositories.customs

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.models.Discipline
import com.rfidreader.models.Group
import com.rfidreader.models.Lesson
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

interface LessonCustomRepository {
    data class SaveLessonInfo(
        val lesson: Lesson,
        val groupIds: List<Long> = listOf(),
        val disciplineId: Long
    )
    fun saveLessonWithGroupsAndDiscipline(saveInfo: SaveLessonInfo)
}

@Repository
class LessonCustomRepositoryImpl : LessonCustomRepository {
    @PersistenceContext
    private lateinit var entityManager: EntityManager

    @Transactional
    override fun saveLessonWithGroupsAndDiscipline(saveInfo: LessonCustomRepository.SaveLessonInfo) {
        val query = entityManager.criteriaBuilder.createQuery(Group::class.java)
        val groups = entityManager.createQuery(query.from(Group::class.java).let {
            query.select(it).where(it.get<Long>("id").`in`(saveInfo.groupIds))
        }).resultList
        val entity = saveInfo.lesson.apply {
            discipline = discipline ?: entityManager.find(Discipline::class.java, saveInfo.disciplineId).let {
                if(it == null) throw ProcessException("Discipline not found") else it
            }
            this@apply.groups.addAll(groups)
        }
        groups.forEach { it.lessons.add(entity) }
        entityManager.persist(entity)
        entityManager.flush()
    }

}