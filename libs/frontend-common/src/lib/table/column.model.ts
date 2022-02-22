export interface Column {
  columnDef: string
  header: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  cell: Function
  isLink?: boolean
  url?: string
}
