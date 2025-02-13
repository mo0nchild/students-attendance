import type { AxiosResponse } from "axios";
import type { INewStudent, ISearchInfo, IStudentInfo, IUpdateStudent } from "@models/student";
import $api from "@utils/api";

class StudentService {
    public async getStudentsByGroup(groupId: number): Promise<AxiosResponse<IStudentInfo[]>> {
        return await $api.get(`/students/getAll/group/${groupId}`)
    }
    public async addStudent(student: INewStudent): Promise<AxiosResponse> {
        return await $api.post(`/students/add`, student)
    }
    public async addAllStudents(students: INewStudent[]): Promise<AxiosResponse> {
        return await $api.post(`/students/addAll`, students)
    }
    public async removeStudent(id: number): Promise<AxiosResponse> {
        return await $api.delete(`/students/remove/${id}`)
    }
    public async updateStudent(student: IUpdateStudent): Promise<AxiosResponse> {
        return await $api.put(`/students/update`, student)
    }
    public async searchStudents(fio: string): Promise<AxiosResponse<ISearchInfo[]>> {
        return await $api.get(`/students/find/${fio}`)
    }
    public async getStudentByRfidCode(rfidCode: string): Promise<AxiosResponse<IStudentInfo>> {
        return await $api.get(`/students/get/rfidCode?rfidCode=${rfidCode}`)
    }
}
export const studentService = new StudentService()