declare module 'react-hot-toast' {
  export const Toaster: any
  export const toast: {
    success: (msg: string) => void
    error: (msg: string) => void
    [key: string]: any
  }
}


