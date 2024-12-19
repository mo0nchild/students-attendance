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