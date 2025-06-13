export type SearchResultType = {
    fullPath: string;
    objectID: string;
    hightlights: string;
    description: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertToSearchResult (data: any[]): SearchResultType[] {
    return data.map((d) => {
        return {
            fullPath: String(d.fullPath),
            objectID: String(d.objectID),
            hightlights: String(d.highlights),
            description: String(d.description)
        }
    })
}