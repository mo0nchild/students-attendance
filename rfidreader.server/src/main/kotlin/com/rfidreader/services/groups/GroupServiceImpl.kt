package com.rfidreader.services.groups

import com.rfidreader.infrastructures.exceptions.ProcessException
import com.rfidreader.repositories.GroupRepository
import com.rfidreader.services.groups.models.GroupDto
import com.rfidreader.services.groups.models.GroupMapper
import com.rfidreader.services.groups.models.NewGroup
import com.rfidreader.services.groups.models.UpdateGroup
import jakarta.validation.Validator
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.collections.first

@Service
class GroupServiceImpl(
    private val groupRepository: GroupRepository,
    private val validator: Validator
) : GroupService {
    private val groupMapper = GroupMapper.INSTANCE
    @Transactional
    override fun addGroup(newGroup: NewGroup) {
        validator.validate(newGroup).let {
            if(it.isNotEmpty()) throw ProcessException(it.first().message)
        }
        groupRepository.findGroupByName(newGroup.name).let {
            if (it.isNotEmpty()) throw ProcessException("Group already exists")
        }
        groupRepository.save(groupMapper.toGroupEntity(newGroup))
    }
    @Transactional
    override fun deleteGroup(id: Long) {
        val entity = groupRepository.findById(id).orElseThrow { ProcessException("Group not found") }
        groupRepository.delete(entity)
    }
    @Transactional
    override fun updateGroup(group: UpdateGroup) {
        validator.validate(group).let {
            if(it.isNotEmpty()) throw ProcessException(it.first().message)
        }
        val entity = groupRepository.findById(group.id).orElseThrow { ProcessException("Group not found") }
            .also {
                it.name = group.name
                it.faculty = group.faculty
            }
        groupRepository.save(entity)
    }
    override fun getAllGroups(): List<GroupDto> {
        return groupRepository.findAll().map { groupMapper.toGroupDto(it) }
    }
    override fun getGroupsByFaculty(faculty: String): List<GroupDto> {
        return groupRepository.findGroupByFaculty(faculty).map { groupMapper.toGroupDto(it) }
    }
}