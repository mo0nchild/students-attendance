/* eslint-disable prettier/prettier */
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
export function getStudentsFromString(text: string): StudentFileData[] {
    return (text).split('\n').filter(item => item.split(' ').length == 3)
        .map(item => {
            const studentProps = item.split(' ')
            return { 
                surname: studentProps[0],
                name: studentProps[1],
                patronymic: studentProps[2]
            } as StudentFileData
        })
}