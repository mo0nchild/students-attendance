package com.rfidreader.services.groups.models

import com.rfidreader.models.Group
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingConstants
import org.mapstruct.Mappings
import org.mapstruct.ReportingPolicy
import org.mapstruct.factory.Mappers

@Mapper(
    componentModel = MappingConstants.ComponentModel.DEFAULT,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
interface GroupMapper {
    @Mappings(
        Mapping(target = "id", source = "id"),
    )
    fun toGroupDto(group: Group): GroupDto
    @Mappings(
        Mapping(target = "id", ignore = true),
        Mapping(target = "students", ignore = true)
    )
    fun toGroupEntity(groupDto: NewGroup): Group

    companion object {
        val INSTANCE: GroupMapper = Mappers.getMapper(GroupMapper::class.java)
    }
}