/* eslint-disable prettier/prettier */
export interface Api {
    getFileData: (info: { readonly path: string }) => Promise<string>,
    openFileDialog: () => Promise<string | undefined>
}