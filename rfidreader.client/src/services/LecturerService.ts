import { ILecturerInfo, INewLecturer, IUpdateLecturer } from "@core/models/lecturer";
import $api from "@core/utils/api";
import { AxiosResponse } from "axios";

class LecturerService {
    public async getAllLecturers(): Promise<AxiosResponse<ILecturerInfo[]>> {
        return await $api.get(`/lecturer/getAll`)
    }
    public async addLecturer(lecturer: INewLecturer): Promise<AxiosResponse> {
        return await $api.post(`/lecturer/add`, lecturer)
    }
    public async removeLecturer(id: number): Promise<AxiosResponse> {
        return await $api.delete(`/lecturer/remove/${id}`)
    }
    public async updateLecturer(lecturer: IUpdateLecturer): Promise<AxiosResponse> {
        return await $api.put(`/lecturer/update`, lecturer)
    }
}
export const lecturerService = new LecturerService()