package com.rfidreader.models

import jakarta.persistence.*

@Suppress("JpaObjectClassSignatureInspection")
@Entity
@Table(name = "Students")
data class Student (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    var name: String,
    var surname: String,
    var patronymic: String,
    var rfidCode: String,
) {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id")
    var group: Group? = null

    @OneToMany(mappedBy = "student", cascade = [CascadeType.ALL])
    var attendances: MutableList<Attendance> = mutableListOf()
}