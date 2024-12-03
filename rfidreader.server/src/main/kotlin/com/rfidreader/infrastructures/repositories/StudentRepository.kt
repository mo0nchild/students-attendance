package com.rfidreader.infrastructures.repositories

import com.rfidreader.infrastructures.repositories.customs.StudentCustomRepository
import com.rfidreader.models.Student
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface StudentRepository : JpaRepository<Student, Long>, StudentCustomRepository {
    
    @Query("SELECT s FROM Student s WHERE s.group.id = :groupId ")
    fun getStudentByGroupId(@Param("groupId") groupId: Long): List<Student>

    @Query("SELECT s FROM Student s WHERE s.rfidCode = :rfidCode")
    fun getStudentsByRfidCode(@Param("rfidCode") rfidCode: String): List<Student>
}