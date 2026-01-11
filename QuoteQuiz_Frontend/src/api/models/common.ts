export type ApiEnvelope<T> = {
  status: 'Success' | 'Error' | string
  data: T
  errorMessages?: string[] | null
  errors?: unknown
}


