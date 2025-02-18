/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view"
import Processing, { LoadingStatus } from "@renderer/components/processing/Processing"
import { IDisciplineInfo } from "@renderer/models/discipline"
import { IGroupInfo } from "@renderer/models/group"
import { disciplineService } from "@renderer/services/DisciplineService"
import { lessonService } from "@renderer/services/LessonService"
import { GroupByResult } from "@renderer/utils/processing"
import { useState, useRef, useEffect } from "react"

export interface NavigationTreeViewProps {
    onClick?: (disciplineId: number, group: IGroupInfo) => void
}
export function NavigationTreeView({ onClick }: NavigationTreeViewProps): JSX.Element {
    const [ dispciplineGroups, setDisciplineGroups ] = useState<GroupByResult<IGroupInfo>>()
    const [ status, setStatus ] = useState<LoadingStatus>('loading')

    const disciplines = useRef<IDisciplineInfo[]>([])
    useEffect(() => {
        (async () => {
            const disciplinesResponse = (await disciplineService.getAllDisciplines()).data
            const grouping = { } as GroupByResult<IGroupInfo>
            await Promise.all(disciplinesResponse.map(async (item) => {
                if (!grouping[item.name]) grouping[item.name] = []
                const lessonResponse = (await lessonService.getLessonsByDiscipline(item.id)).data

                for (const lesson of lessonResponse) {
                    const sortedLesson = lesson.groups.sort((a, b) => a.name.localeCompare(b.name))
                    for (const group of sortedLesson) {
                        if (!grouping[item.name].some(it => it.id == group.id)) {
                            grouping[item.name].push(group)
                        }
                    }
                }
            }))
            disciplines.current = disciplinesResponse
            setDisciplineGroups(grouping)
        })().then(() => setStatus('success'))
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [])
    return (
    <div style={{maxHeight: '200px', overflowY: 'auto'}}>
    <Processing status={status}>
        <SimpleTreeView>
        {
        !dispciplineGroups ? <></> : Object.keys(dispciplineGroups!).map((item, index) => {
            return (
            <TreeItem key={`discipline#${index}`} itemId={`discipline#${index}`} label={item}>
            {
            dispciplineGroups![item].map((groupItem, groupIndex) => {
                return (
                <TreeItem itemId={`group#${groupIndex}-discipline#${index}`} label={groupItem.name}
                    key={`group#${groupIndex}-discipline#${index}`}
                    onMouseDown={() => {
                        const dispciplineId = disciplines.current.find(it => it.name == item)
                        if (dispciplineId) onClick?.(dispciplineId.id, groupItem)
                    }}/>
                )
            })
            }
            </TreeItem>
            )
        })
        }
        </SimpleTreeView>
    </Processing>
    </div>
    )
}