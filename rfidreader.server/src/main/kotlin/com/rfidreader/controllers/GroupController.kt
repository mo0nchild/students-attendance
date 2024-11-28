package com.rfidreader.controllers

import com.rfidreader.services.groups.GroupService
import com.rfidreader.services.groups.models.GroupDto
import com.rfidreader.services.groups.models.NewGroup
import com.rfidreader.services.students.models.StudentDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/group")
class GroupController(private val groupService: GroupService) {
    @GetMapping("/getAll")
    fun getAllGroups(): ResponseEntity<List<GroupDto>> {
        return ResponseEntity.ok(groupService.getAllGroups())
    }
    @PostMapping("/add")
    fun addGroup(@RequestBody group: NewGroup): ResponseEntity<String> {
        groupService.addGroup(group)
        return ResponseEntity.ok("Group successfully added")
    }
    @DeleteMapping("/remove/{id}")
    fun removeGroup(@PathVariable id: Long): ResponseEntity<String> {
        groupService.deleteGroup(id)
        return ResponseEntity.ok("Group successfully deleted")
    }
    @GetMapping("getAll/faculty/{name}")
    fun getGroupsByFaculty(@PathVariable("name") name: String): ResponseEntity<List<GroupDto>> {
        return ResponseEntity.ok(groupService.getGroupsByFaculty(name))
    }
}