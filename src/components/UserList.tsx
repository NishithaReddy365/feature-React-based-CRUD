import React from 'react'
import { User } from '../types'

type Props = {
  users: User[]
  onEdit: (u: User) => void
  onDelete: (id: number) => void
}

export default function UserList({ users, onEdit, onDelete }: Props) {
  if (users.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
        No users found. Click "New User" to add one.
      </div>
    )
  }

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Phone</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{u.firstName} {u.lastName}</td>
              <td style={{ padding: 8 }}>{u.phone}</td>
              <td style={{ padding: 8 }}>{u.email}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>
                <button onClick={() => onEdit(u)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => u.id && onDelete(u.id)} style={{ color: 'crimson' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
