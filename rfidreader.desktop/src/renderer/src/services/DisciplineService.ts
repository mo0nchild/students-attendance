import { IDisciplineInfo, INewDiscipline, IUpdateDiscipline } from "@core/models/discipline";
import $api from "@core/utils/api";
import { AxiosResponse } from "axios";

class DisciplineService {
    public async getAllDisciplines(): Promise<AxiosResponse<IDisciplineInfo[]>> {
        return await $api.get(`/discipline/getAll`)
    }
    public async addDiscipline(discipline: INewDiscipline): Promise<AxiosResponse> {
        return await $api.post(`/discipline/add`, discipline)
    }   
    public async removeDiscipline(id: number): Promise<AxiosResponse> {
        return await $api.delete(`/discipline/remove/${id}`)
    }
    public async updateDiscipline(group: IUpdateDiscipline): Promise<AxiosResponse> {
        return await $api.put(`/discipline/update`, group)
    }
}
export const disciplineService = new DisciplineService()