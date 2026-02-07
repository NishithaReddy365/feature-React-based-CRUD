import React, { useEffect, useState } from 'react'
import { api } from './api'
import { User, FieldSchema } from './types'
import UserList from './components/UserList'
import UserForm from './components/UserForm'

const schema: FieldSchema[] = [
  { name: 'firstName', label: 'First Name', required: true },
  { name: 'lastName', label: 'Last Name', required: true },
  { name: 'phone', label: 'Phone Number', required: true },
  { name: 'email', label: 'Email Address', required: true }
]

export default function App() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  async function load() {
    setLoading(true)
    try {
      const data = await api.listUsers()
      setUsers(data)
    } catch (err) {
      console.error(err)
      alert('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(u: User) {
    try {
      await api.createUser(u)
      setShowForm(false)
      load()
    } catch (err) { alert('Create failed') }
  }

  async function handleUpdate(u: User) {
    if (!u.id) return
    try {
      await api.updateUser(u.id, u)
      setEditing(null)
      setShowForm(false)
      load()
    } catch (err) { alert('Update failed') }
  }

  async function handleDelete(id: number) {
    // previous behavior replaced by modal confirmation
    setPendingDeleteId(id)
  }

  async function performDelete() {
    if (!pendingDeleteId) return
    try {
      await api.deleteUser(pendingDeleteId)
      setPendingDeleteId(null)
      load()
    } catch (err) {
      alert('Delete failed')
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Users</h2>
        <div className="stack">
          <button onClick={() => { setEditing(null); setShowForm(s => !s) }} style={{ padding: '8px 12px' }}>{showForm ? 'Close' : 'New User'}</button>
        </div>
      </div>

      <div className="cols">
        <div className="card">
          <div style={{ marginBottom: 8 }}>
            {loading ? <em>Loading...</em> : `${users.length} user(s)`}
          </div>
          <UserList users={users} onEdit={(u) => { setEditing(u); setShowForm(true) }} onDelete={handleDelete} />
        </div>

        <div>
          {showForm && (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>{editing ? 'Edit User' : 'Create User'}</h3>
              <UserForm
                schema={schema}
                initial={editing ?? {}}
                onSubmit={editing ? handleUpdate : handleCreate}
                onCancel={() => { setShowForm(false); setEditing(null) }}
              />
            </div>
          )}
        </div>
      </div>

      {pendingDeleteId && (
        <div className="modal-overlay">
          <div className="modal card">
            <h4 style={{ marginTop: 0 }}>Confirm delete</h4>
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setPendingDeleteId(null)} style={{ padding: '8px 12px' }}>Cancel</button>
              <button className="btn-danger" onClick={performDelete} style={{ padding: '8px 12px' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
