package com.rfidreader.services.disciplines.models

import com.rfidreader.models.Discipline
import org.mapstruct.*
import org.mapstruct.factory.Mappers

@Mapper(
    componentModel = MappingConstants.ComponentModel.DEFAULT,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
interface DisciplineMapper {
    @Mappings(
        Mapping(target = "id", source = "id"),
    )
    fun toDisciplineDto(discipline: Discipline): DisciplineDto
    @Mappings(
        Mapping(target = "lecturer", ignore = true),
        Mapping(target = "lessons", ignore = true)
    )
    fun toDisciplineEntity(newDiscipline: NewDiscipline): Discipline

    companion object {
        val INSTANCE: DisciplineMapper = Mappers.getMapper(DisciplineMapper::class.java)
    }
}