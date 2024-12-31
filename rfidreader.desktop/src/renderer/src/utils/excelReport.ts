import * as ExcelJS from 'exceljs'
import { IDisciplineInfo } from "@core/models/discipline"
import { IGroupAttendancesOnLesson } from "@core/models/lesson"
import { convertToDDMM } from './processing'

export async function excelReport(
    { group, lessons }: IGroupAttendancesOnLesson,
    disciplineInfo: IDisciplineInfo
): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')
    
    const students = lessons[0].students.map(({student}) => ({
        id: student.id,
        FIO: `${student.surname} ${student.name[0]}. ${student.patronymic[0]}.`
    }))  
    worksheet.addRow([])
    worksheet.getRow(1).height = 40
    worksheet.addRow([undefined, `Группа: ${group.faculty} ${group.name}\n`
        + `Дисциплина: ${disciplineInfo.name}`])
    worksheet.mergeCells(2, 2, 2, 6)
    worksheet.addRow([])

    const timeList = lessons.map(it => it.time)
    const timeRow = worksheet.getRow(4)
    worksheet.getRow(4).border = {
        top: { style: 'mediumDashed', color: { argb: '000000' } },
        bottom: { style: 'mediumDashed', color: { argb: '000000' } }
    }
    for(let i = 0; i < timeList.length; i++) {
        timeRow.getCell(i + 3).value = convertToDDMM(timeList[i]).split(' ').join('\n')
        timeRow.getCell(i + 3).border = mainBorder
        worksheet.getColumn(i + 3).width = 12
        worksheet.getColumn(i + 3).alignment = { wrapText: true, horizontal: 'center' }
        worksheet.getColumn(i + 3).font = { size: 12 }
    }
    worksheet.getCell(4, 1).border = worksheet.getCell(4, 2).border = null!
    for(let row = 0; row < students.length; row++) {
        const tableRow = worksheet.getRow(row + 5)
        tableRow.border = {
            top: { style: 'dashDotDot', color: { argb: '000000' } },
            bottom: { style: 'dashDotDot', color: { argb: '000000' } }
        }
        tableRow.alignment = { vertical: 'middle' }
        tableRow.height = 20
        tableRow.getCell(2).value = students[row].FIO
        tableRow.getCell(2).border = mainBorder
        tableRow.getCell(2).font = { size: 13 }
        for (let col = 0; col < timeList.length; col++) {
            const check = lessons[col].students.find(({ student }) => student.id == students[row].id)?.time 
            tableRow.getCell(col + 3).value = check == null ? '-' : '+'
            tableRow.getCell(col + 3).fill = check == null ? notCheckColor : checkColor
            tableRow.getCell(col + 3).font = { size: 14, bold: true }
            tableRow.getCell(col + 3).alignment = { vertical: 'middle', horizontal: 'center' }
            tableRow.getCell(col + 3).border = secondBorder
        }
    }
    worksheet.getCell(4, 2).value = 'ФИО студента'
    worksheet.getCell(4, 2).border = secondBorder
    worksheet.getCell(4, 2).alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.getCell(4, 2).font = { size: 14, bold: true }

    worksheet.getColumn(2).width = 20
    worksheet.getRow(3).height = 30
    worksheet.getRow(2).border = {
        top: { style: 'mediumDashed', color: { argb: '000000' } },
        bottom: { style: 'mediumDashed', color: { argb: '000000' } }
    }
    worksheet.getCell(2, 2).border = mainBorder
    worksheet.getColumn(1).border = { 
        right: { style: 'mediumDashed', color: { argb: '000000' } }
    }
    worksheet.getCell(2, 2).font = { size: 16, bold: true }
    worksheet.getRow(3).height = 50
    worksheet.getRow(4).height = 30
    worksheet.getRow(2).height = 50
    worksheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    
    worksheet.addRow([])
    worksheet.getRow(8).height = 30
    for(let i = 0; i < lessons.length + 1; i++) {
        worksheet.getCell(8, i + 2).border = {
            left: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
        }
    }
    const footer = worksheet.getRow(9)
    footer.getCell(2).value = 'Статистика:'
    footer.getCell(2).border = {
        left: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
    }
    for(let i = 0; i < lessons.length; i++) {
        const { students } = lessons[i]
        const stat = students.filter(it => it.time != null).length / students.length
        footer.getCell(i + 3).value = `${((stat * 100) || 0).toFixed(2)}%`
        footer.getCell(i + 3).border = secondBorder
    }
    return await workbook.xlsx.writeBuffer();
}
const secondBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: '000000' } },
    left: { style: 'thin', color: { argb: '000000' } },
    bottom: { style: 'thin', color: { argb: '000000' } },
    right: { style: 'thin', color: { argb: '000000' } }
}
const mainBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'medium', color: { argb: '000000' } },
    left: { style: 'medium', color: { argb: '000000' } },
    bottom: { style: 'medium', color: { argb: '000000' } },
    right: { style: 'medium', color: { argb: '000000' } }
}
const notCheckColor: ExcelJS.Fill = { 
    type: 'pattern',
    pattern: 'solid', 
    fgColor: { argb: 'ff8064' } 
}
const checkColor: ExcelJS.Fill = { 
    type: 'pattern',
    pattern: 'solid', 
    fgColor: { argb: '67ff64' }, 
}