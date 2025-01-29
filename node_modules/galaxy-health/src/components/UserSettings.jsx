import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import './UserSettings.css';

const ROLES = [
  { id: 'nurse', label: 'Nurse' },
  { id: 'physician', label: 'Physician' },
  { id: 'practice_staff', label: 'Practice Staff' },
  { id: 'analyst', label: 'Analyst' }
];

export function UserSettings() {
  const { user, updateUserProfile } = useUser();
  const [role, setRole] = useState(user?.role || '');
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
  }, [user]);

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setSaving(true);
    setError(null);

    try {
      await updateUserProfile({ role: newRole });
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update role. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div className="user-settings">Please log in to access settings.</div>;
  }

  return (
    <div className="user-settings">
      <h2>User Settings</h2>
      
      <div className="settings-section">
        <h3>Profile Information</h3>
        <div className="profile-info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.displayName}</p>
        </div>
      </div>

      <div className="settings-section">
        <h3>Role Selection</h3>
        <div className="role-selector">
          <label htmlFor="role">Select your role:</label>
          <select 
            id="role" 
            value={role} 
            onChange={handleRoleChange}
            disabled={isSaving}
          >
            <option value="">Select a role...</option>
            {ROLES.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          {isSaving && <span className="saving-indicator">Saving...</span>}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
} 