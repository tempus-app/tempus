export interface Column {
  columnDef: string
  header: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  cell: Function
  // TODO: add link functionality
  isLink?: boolean
  url?: string
}
