import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import type { QuoteDto } from '../../api/models/quotes'

type CreateFormValues = { Text: string; Author: string }
type UpdateFormValues = { Text: string; Author: string }

type CommonProps = {
  open: boolean
  onClose: () => void
}

type CreateProps = CommonProps & {
  mode: 'create'
  initialQuote?: undefined
  onSubmitCreate: (values: CreateFormValues) => void
}

type EditProps = CommonProps & {
  mode: 'edit'
  initialQuote: QuoteDto
  onSubmitEdit: (values: UpdateFormValues) => void
}

type QuoteModalProps = CreateProps | EditProps

export default function QuoteModal(props: QuoteModalProps) {
  if (!props.open) return null
  if (props.mode === 'create') return <CreateQuoteModal {...props} />
  return <EditQuoteModal {...props} />
}

function CreateQuoteModal({ open, onClose, onSubmitCreate }: CreateProps) {
  const schema = yup.object({
    Text: yup.string().required('Text is required'),
    Author: yup.string().required('Author is required')
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    trigger
  } = useForm<CreateFormValues>({
    resolver: yupResolver(schema, { abortEarly: false }),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: { Text: '', Author: '' }
  })

  useEffect(() => {
    if (open) {
      reset({ Text: '', Author: '' })
      trigger()
    }
  }, [open, reset])

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <button type="button" className="modal-close" aria-label="Close modal" onClick={onClose}>
          <i className="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
        <div className="modal-header">
          <h2>Create Quote</h2>
        </div>
        <form className="modal-body form-vertical" noValidate onSubmit={handleSubmit(onSubmitCreate)}>
          <div className="form-row">
            <label htmlFor="create-text">Text</label>
            <textarea id="create-text" className="text-input" rows={4} {...register('Text')} />
            {errors.Text && <div className="error-text">{errors.Text.message}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="create-author">Author</label>
            <input id="create-author" className="text-input" {...register('Author')} />
            {errors.Author && <div className="error-text">{errors.Author.message}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditQuoteModal({ initialQuote, onClose, onSubmitEdit }: EditProps) {
  const schema = yup.object({
    Text: yup.string().required('Text is required'),
    Author: yup.string().required('Author is required')
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    trigger: triggerEdit
  } = useForm<UpdateFormValues>({
    resolver: yupResolver(schema, { abortEarly: false }),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: { Text: initialQuote.text, Author: initialQuote.author }
  })

  useEffect(() => {
    reset({ Text: initialQuote.text, Author: initialQuote.author })
    triggerEdit()
  }, [initialQuote, reset])

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <button type="button" className="modal-close" aria-label="Close modal" onClick={onClose}>
          <i className="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
        <div className="modal-header">
          <h2>Edit Quote</h2>
        </div>
        <form className="modal-body form-vertical" noValidate onSubmit={handleSubmit(onSubmitEdit)}>
          <div className="form-row">
            <label htmlFor="edit-text">Text</label>
            <textarea id="edit-text" className="text-input" rows={4} {...register('Text')} />
            {errors.Text && <div className="error-text">{errors.Text.message}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="edit-author">Author</label>
            <input id="edit-author" className="text-input" {...register('Author')} />
            {errors.Author && <div className="error-text">{errors.Author.message}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


