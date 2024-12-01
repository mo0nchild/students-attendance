package com.rfidreader.services.groups

import com.rfidreader.services.groups.models.GroupDto
import com.rfidreader.services.groups.models.NewGroup
import com.rfidreader.services.groups.models.UpdateGroup

interface GroupService {
    fun addGroup(newGroup: NewGroup): Unit
    fun deleteGroup(id: Long): Unit
    fun updateGroup(group: UpdateGroup): Unit

    fun getAllGroups(): List<GroupDto>
    fun getGroupsByFaculty(faculty: String): List<GroupDto>
}