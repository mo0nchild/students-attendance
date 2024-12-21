export async function getDataFromJsonFile<T>(): Promise<T> {
    const [ fileHandle ] = await window.showOpenFilePicker({
        types: [
            {
                description: 'JSON Files',
                accept: {'application/json': ['.json']},
            },
        ],
        multiple: false,
    })
    const file = await fileHandle.getFile()
    return JSON.parse(await file.text()) as T
}
export type StudentFileData = { surname: string, name: string, patronymic: string }
export async function getStudentsFromFile(): Promise<StudentFileData[]> {
    const [ fileHandle ] = await window.showOpenFilePicker({
        types: [
            {
                description: 'Text Files',
                accept: {'text/plain': ['.txt']},
            },
        ],
        multiple: false,
    })
    const file = await fileHandle.getFile()
    return (await file.text()).split('\n').filter(item => item.split(' ').length == 3)
        .map(item => {
            const studentProps = item.split(' ')
            return { 
                surname: studentProps[0],
                name: studentProps[1],
                patronymic: studentProps[2]
            } as StudentFileData
        })
}