import { IGroupInfo, INewGroup, IUpdateGroup } from "@core/models/group";
import $api from "@core/utils/api";
import { AxiosResponse } from "axios";

class GroupService {
    public async getAllGroups(): Promise<AxiosResponse<IGroupInfo[]>> {
        return await $api.get(`/group/getAll`)
    }
    public async addGroup(group: INewGroup): Promise<AxiosResponse> {
        return await $api.post(`/group/add`, group)
    }
    public async removeGroup(id: number): Promise<AxiosResponse> {
        return await $api.delete(`/group/remove/${id}`)
    }
    public async updateGroup(group: IUpdateGroup): Promise<AxiosResponse> {
        return await $api.put(`/group/update`, group)
    }
}
export const groupService = new GroupService()