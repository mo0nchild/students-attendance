package com.rfidreader.repositories

import com.rfidreader.models.Student
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface StudentRepository : JpaRepository<Student, Long> {
    
    @Query("SELECT s FROM Student s WHERE s.group.id = :groupId ")
    fun getStudentByGroupId(@Param("groupId") groupId: Long): List<Student>
}