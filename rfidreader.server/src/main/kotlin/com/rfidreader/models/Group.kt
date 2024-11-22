package com.rfidreader.models

import jakarta.persistence.*

@Suppress("JpaObjectClassSignatureInspection")
@Entity
data class Group (
    @Id @GeneratedValue
    val id: Long,
    val name: String,
    val faculty: String,

    @OneToMany(mappedBy = "group", cascade = [CascadeType.ALL])
    val students: List<Student> = emptyList(),
)