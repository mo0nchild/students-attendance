package com.rfidreader.services.groups

import com.rfidreader.services.groups.models.GroupDto
import com.rfidreader.services.groups.models.NewGroup

interface GroupService {
    fun addGroup(newGroup: NewGroup): Unit
    fun deleteGroup(id: Long): Unit

    fun getAllGroups(): List<GroupDto>
}