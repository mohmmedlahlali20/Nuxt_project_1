export interface Item {
    id: number | string
    name: string
    data: dataItem
    image: string
}

export interface dataItem {
    color: string
    capacity: string
}