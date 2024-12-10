package com.rfidreader.models

import jakarta.persistence.*

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Groups")
data class Group (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    var name: String,
    var faculty: String,
) {
    @OneToMany(mappedBy = "group", cascade = [CascadeType.ALL], orphanRemoval = true)
    var students: MutableList<Student> = mutableListOf()

    @ManyToMany(cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    var lessons: MutableList<Lesson> = mutableListOf()

    @PreRemove
    private fun removeGroupFromLesson(): Unit {
        for(it in lessons) it.groups.remove(this)
    }
}