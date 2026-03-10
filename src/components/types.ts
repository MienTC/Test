export type Option = {
  id: string
  value: string
  label: string
  sortOrder: number
}

export type Question = {
  id: string
  name: string
  description: string
  sortOrder: number
  options: Option[]
  correctOptionValues: string[]
}

export type Quiz = {
  name: string
  description: string
  questions: Question[]
}

export type ValidationError = {
  path: string
  message: string
}

