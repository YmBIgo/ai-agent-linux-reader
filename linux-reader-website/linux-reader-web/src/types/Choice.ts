export type Choice = {
    functionName: string;
    functionCodeLine: string;
    originalFilePath: string;
    id: string;
    functionCodeContent?: string;
}
export type ChoiceTree = {
    content: Choice
    children: ChoiceTree[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertToChoiceTree = (data: any): ChoiceTree => {
    return {
        content: {
            functionName: String(data?.content?.functionName ?? ""),
            functionCodeLine: String(data?.content?.functionCodeLine ?? ""),
            originalFilePath: String(data?.content?.originalFilePath ?? ""),
            id: String(data?.content?.id ?? ""),
            functionCodeContent: String(data?.content?.functionCodeContent ?? "")
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: (data.children ?? []).map((d: any) => convertToChoiceTree(d.children))
    }
}