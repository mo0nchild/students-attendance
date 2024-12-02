import { studentService } from '@services/StudentService'

export default function HomePage(): JSX.Element {
    return (
        <div>
            <button onClick={async () =>  
                console.log(await studentService.getStudentsByGroup(1))
            }>TEST</button>
        </div>
    )
}