package com.rfidreader.services.lessons.models

import com.rfidreader.models.Lesson
import com.rfidreader.services.disciplines.models.DisciplineMapper
import com.rfidreader.services.groups.models.GroupMapper
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingConstants
import org.mapstruct.Mappings
import org.mapstruct.ReportingPolicy
import org.mapstruct.factory.Mappers

@Mapper(
    componentModel = MappingConstants.ComponentModel.DEFAULT,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = [GroupMapper::class, DisciplineMapper::class]
)
interface LessonMapper {
    @Mappings(
        Mapping(target = "id", source = "id"),
    )
    fun toLessonDto(lesson: Lesson): LessonDto
    @Mappings(
        Mapping(target = "id", ignore = true),
        Mapping(target = "attendances", ignore = true),
        Mapping(target = "discipline", ignore = true),
        Mapping(target = "groups", ignore = true),
    )
    fun toLessonEntity(newLesson: NewLesson): Lesson

    companion object {
        val INSTANCE: LessonMapper = Mappers.getMapper(LessonMapper::class.java)
    }
}