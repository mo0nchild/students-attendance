import { IGroupAttendancesOnLesson, ILessonInfo, INewLesson, IStudentOnLesson, IUpdateLesson } from "@core/models/lesson";
import $api from "@core/utils/api";
import { AxiosResponse } from "axios";

class LessonService {
    public async getLessonsByDiscipline(disciplineId: number): Promise<AxiosResponse<ILessonInfo[]>> {
        return await $api.get(`/lesson/getAll/discipline/${disciplineId}`)
    }
    public async getInfo(id: number): Promise<AxiosResponse<IStudentOnLesson[]>> {
        return await $api.get(`/lesson/getInfo/${id}`)
    }
    public async addLesson(group: INewLesson): Promise<AxiosResponse> {
        return await $api.post(`/lesson/add`, group)
    }
    public async removeLesson(id: number): Promise<AxiosResponse> {
        return await $api.delete(`/lesson/remove/${id}`)
    }
    public async updateLesson(group: IUpdateLesson): Promise<AxiosResponse> {
        return await $api.put(`/lesson/update`, group)
    }
    public async getLessonsByGroup(disciplineId: number, groupId: number): Promise<AxiosResponse<IGroupAttendancesOnLesson>> {
        return await $api.get(`/lesson/getGroup/${disciplineId}/${groupId}`)
    } 
}
export const lessonService = new LessonService()