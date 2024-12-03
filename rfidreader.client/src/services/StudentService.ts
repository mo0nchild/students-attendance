import type { AxiosResponse } from "axios";
import type { INewStudent, IStudentInfo, IUpdateStudent } from "@models/student";
import $api from "@utils/api";

class StudentService {
    public async getStudentsByGroup(groupId: number): Promise<AxiosResponse<IStudentInfo[]>> {
        return await $api.get(`/students/getAll/group/${groupId}`)
    }
    public async addStudent(student: INewStudent): Promise<AxiosResponse> {
        return await $api.post(`/students/add`, student)
    }
    public async removeStudent(id: number): Promise<AxiosResponse> {
        return await $api.delete(`/students/remove/${id}`)
    }
    public async updateStudent(student: IUpdateStudent): Promise<AxiosResponse> {
        return await $api.put(`/students/update`, student)
    }
}
export const studentService = new StudentService()