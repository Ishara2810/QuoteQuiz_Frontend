import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import type { UserDto } from '../../api/models/users'
import type { RoleDto } from '../../api/models/roles'

type CreateFormValues = {
  FirstName: string
  LastName: string
  Email: string
  Password: string
  ConfirmPassword: string
  RoleId: string
  IsActive: boolean
}
type UpdateFormValues = {
  FirstName: string
  LastName: string
  Email: string
  RoleId: string
  IsActive: boolean
}

type CommonProps = {
  open: boolean
  onClose: () => void
}

type CreateProps = CommonProps & {
  mode: 'create'
  initialUser?: undefined
  onSubmitCreate: (values: CreateFormValues) => void
  roles: RoleDto[]
}

type EditProps = CommonProps & {
  mode: 'edit'
  initialUser: UserDto
  onSubmitEdit: (values: UpdateFormValues) => void
  roles: RoleDto[]
}

type UserModalProps = CreateProps | EditProps

export default function UserModal(props: UserModalProps) {
  if (!props.open) return null

  if (props.mode === 'create') {
    return <CreateUserModal {...props} />
  }
  return <EditUserModal {...props} />
}

function CreateUserModal({ open, onClose, onSubmitCreate, roles }: CreateProps) {
  const roleIds = useMemo(() => roles.map((r) => r.id), [roles])
  const createSchema = yup.object({
    FirstName: yup.string().required('First name is required'),
    LastName: yup.string().required('Last name is required'),
    Email: yup.string().email('Enter a valid email address').required('Email is required'),
    RoleId: yup.string().oneOf(roleIds, 'Select a role').required('Role is required'),
    Password: yup
      .string()
      .matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/, 'Min 8 chars, 1 uppercase, 1 symbol')
      .required('Password is required'),
    ConfirmPassword: yup
      .string()
      .oneOf([yup.ref('Password')], 'Passwords must match')
      .required('Retype your password'),
    IsActive: yup.boolean().required()
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateFormValues>({
    resolver: yupResolver(createSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      FirstName: '',
      LastName: '',
      Email: '',
      Password: '',
      ConfirmPassword: '',
      RoleId: roles[0]?.id ?? '',
      IsActive: true
    }
  })

  useEffect(() => {
    if (open) {
      reset({
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
        RoleId: roles[0]?.id ?? '',
        IsActive: true
      })
    }
  }, [open])

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
				<button
					type="button"
					className="modal-close"
					aria-label="Close modal"
					onClick={onClose}
				>
					<i className="fa-solid fa-xmark" aria-hidden="true"></i>
				</button>
        <div className="modal-header">
          <h2>Create User</h2>
        </div>
        <form
          className="modal-body form-vertical"
          noValidate
          onSubmit={handleSubmit((values) => onSubmitCreate(values))}
        >
          <div className="form-row">
            <label htmlFor="create-firstName">First name</label>
            <input id="create-firstName" className="text-input" {...register('FirstName')} />
            {errors.FirstName && <div className="error-text">{errors.FirstName.message}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="create-lastName">Last name</label>
            <input id="create-lastName" className="text-input" {...register('LastName')} />
            {errors.LastName && <div className="error-text">{errors.LastName.message}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="create-email">Email</label>
            <input id="create-email" type="email" className="text-input" {...register('Email')} />
            {errors.Email && <div className="error-text">{errors.Email.message}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="create-password">Password</label>
            <input id="create-password" type="password" className="text-input" {...register('Password')} />
            {errors.Password && <div className="error-text">{errors.Password.message}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="create-confirm-password">Retype password</label>
            <input id="create-confirm-password" type="password" className="text-input" {...register('ConfirmPassword')} />
            {errors.ConfirmPassword && <div className="error-text">{errors.ConfirmPassword.message}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="create-role">Role</label>
            <select id="create-role" className="text-input" {...register('RoleId')}>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            {errors.RoleId && <div className="error-text">{errors.RoleId.message as string}</div>}
          </div>
          <div className="modal-footer">
					<button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditUserModal({ initialUser, onClose, onSubmitEdit, roles }: EditProps) {
  const roleIds = roles.map((r) => r.id)
  const baseSchema = yup.object({
    FirstName: yup.string().required('First name is required'),
    LastName: yup.string().required('Last name is required'),
    Email: yup.string().email('Enter a valid email address').required('Email is required'),
    RoleId: yup.string().oneOf(roleIds, 'Select a role').required('Role is required'),
    IsActive: yup.boolean().required()
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control
  } = useForm<UpdateFormValues>({
    resolver: yupResolver(baseSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      FirstName: initialUser.firstName,
      LastName: initialUser.lastName,
      Email: initialUser.email,
      RoleId: initialUser.roleId,
      IsActive: initialUser.isActive
    }
  })

  useEffect(() => {
    reset({
      FirstName: initialUser.firstName,
      LastName: initialUser.lastName,
      Email: initialUser.email,
      RoleId: initialUser.roleId,
      IsActive: initialUser.isActive
    })
  }, [initialUser, reset])

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
				<button
					type="button"
					className="modal-close"
					aria-label="Close modal"
					onClick={onClose}
				>
					<i className="fa-solid fa-xmark" aria-hidden="true"></i>
				</button>
        <div className="modal-header">
          <h2>Edit User</h2>
        </div>
        <form
          className="modal-body form-vertical"
          noValidate
          onSubmit={handleSubmit((values) => onSubmitEdit(values))}
        >
          <div className="form-row">
            <label htmlFor="edit-firstName">First name</label>
            <input id="edit-firstName" className="text-input" {...register('FirstName')} />
            {errors.FirstName && <div className="error-text">{errors.FirstName.message}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="edit-lastName">Last name</label>
            <input id="edit-lastName" className="text-input" {...register('LastName')} />
            {errors.LastName && <div className="error-text">{errors.LastName.message}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="edit-email">Email</label>
            <input id="edit-email" type="email" className="text-input" {...register('Email')} />
            {errors.Email && <div className="error-text">{errors.Email.message}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="edit-role">Role</label>
            <select id="edit-role" className="text-input" {...register('RoleId')}>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            {errors.RoleId && <div className="error-text">{errors.RoleId.message as string}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="edit-status">Status</label>
            <Controller
              name="IsActive"
              control={control}
              render={({ field: { value, onChange } }) => (
                <select
                  id="edit-status"
                  className="text-input"
                  value={value ? 'Active' : 'Inactive'}
                  onChange={(e) => onChange(e.target.value === 'Active')}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              )}
            />
          </div>
          <div className="modal-footer">
					<button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


