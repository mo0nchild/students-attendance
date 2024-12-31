package com.rfidreader.controllers

import com.rfidreader.services.disciplines.DisciplineService
import com.rfidreader.services.disciplines.models.DisciplineDto
import com.rfidreader.services.disciplines.models.NewDiscipline
import com.rfidreader.services.disciplines.models.UpdateDiscipline
import com.rfidreader.services.groups.models.GroupDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/discipline")
class DisciplineController(private val disciplineService: DisciplineService) {
    @GetMapping("/getAll")
    fun getAllDisciplines(): ResponseEntity<List<DisciplineDto>> {
        return ResponseEntity.ok(disciplineService.getAllDisciplines())
    }
    @PutMapping("/update")
    fun updateDiscipline(@RequestBody discipline: UpdateDiscipline): ResponseEntity<String> {
        disciplineService.updateDiscipline(discipline)
        return ResponseEntity.ok("Discipline successfully updated")
    }
    @PostMapping("/add")
    fun addDiscipline(@RequestBody newDiscipline: NewDiscipline): ResponseEntity<String> {
        disciplineService.addDiscipline(newDiscipline)
        return ResponseEntity.ok("Discipline successfully added")
    }
    @DeleteMapping("/remove/{id}")
    fun removeDiscipline(@PathVariable id: Long): ResponseEntity<String> {
        disciplineService.removeDiscipline(id)
        return ResponseEntity.ok("Discipline successfully removed")
    }

}