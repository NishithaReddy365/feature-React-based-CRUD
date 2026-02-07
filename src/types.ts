export type User = {
  id?: number
  firstName: string
  lastName: string
  phone: string
  email: string
  [key: string]: any
}

export type FieldSchema = {
  name: string
  label: string
  type?: string
  required?: boolean
  validate?: (v: any) => string | null
}
