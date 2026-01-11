import React from 'react'

type ConfirmDialogProps = {
  open: boolean
  title?: string
  message: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  busy?: boolean
}

export default function ConfirmDialog({
  open,
  title = 'Please confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  busy = false
}: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>{title}</h2>
        </div>
        <div className="modal-body" style={{ paddingTop: 8 }}>
          <div className="muted" style={{ textAlign: 'left' }}>{message}</div>
        </div>
        <div className="modal-footer">
          <button type="button" className="secondary-button" onClick={onCancel} disabled={busy}>
            {cancelText}
          </button>
          <button type="button" className="primary-button" onClick={onConfirm} disabled={busy}>
            {busy ? 'Please wait…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}


