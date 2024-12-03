import Processing, { LoadingStatus } from "@components/processing/Processing"
import { IGroupInfo } from "@core/models/group"
import { groupBy } from "@core/utils/processing"
import { groupService } from "@services/GroupService"
import { useEffect, useState } from "react"
import { Accordion, ListGroup } from "react-bootstrap"
import { NavLink } from "react-router-dom"

export default function GroupPage(): JSX.Element {
    const [groups, setGroups] = useState<IGroupInfo[] | null>(null)
    const [status, setStatus] = useState<LoadingStatus>('loading')
    useEffect(() => {
        groupService.getAllGroups()
            .then(({data}) => {
                setGroups(data)
                setStatus('success')
            })
            .catch(error => {
                console.log(error)
                setStatus('failed')
            })
    }, [])
    const renderGroupsList = (): JSX.Element => {
        if (groups == null) return <div></div>
        const result = groupBy(groups, item => item.faculty)
        return (
        <Accordion>
        {
            Object.keys(result).map((item, index) => {
                return (
                <Accordion.Item key={`item#${index}`} eventKey={index.toString()}>
                    { <Accordion.Header>{item}</Accordion.Header> }
                    <Accordion.Body>
                    <ListGroup>
                    {
                        result[item].map((g, i) => {
                            return <NavLink key={`item#${index}-${i}`} to={`/students/${g.id}`} >
                                <ListGroup.Item>{g.name}</ListGroup.Item>
                            </NavLink>
                        })
                    }
                    </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
                )
            })
        }
        </Accordion>
        )
    }
    return (
    <div>
        <Processing status={status}>{renderGroupsList()}</Processing>
    </div>
    )
}