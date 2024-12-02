import type { AxiosResponse } from "axios";
import type { IStudentInfo } from "@models/student";
import $api from "@utils/api";

class StudentService {
    public async getStudentsByGroup(groupId: number): Promise<AxiosResponse<IStudentInfo>> {
        return await $api.get(`/students/getAll/group/${groupId}`)
    }
}
export const studentService = new StudentService()