package com.rfidreader.repositories

import com.rfidreader.models.Group
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface GroupRepository: JpaRepository<Group, Long> {
    @Query("SELECT g FROM Group g WHERE g.name = :groupName")
    fun findGroupByName(@Param("groupName") groupName: String): List<Group>

    @Query("SELECT g FROM Group g WHERE g.faculty = :faculty")
    fun findGroupByFaculty(@Param("faculty") faculty: String): List<Group>
}