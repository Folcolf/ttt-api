export type Route = {
  path: string
  method: string
  handlers: () => void[]
}
