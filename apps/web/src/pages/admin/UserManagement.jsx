import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Group, 
  Text, 
  Badge, 
  ActionIcon, 
  Menu,
  Modal,
  TextInput,
  Select,
  Stack
} from '@mantine/core';
import { IconDots, IconEdit, IconTrash, IconLock } from '@tabler/icons-react';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const userData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (values) => {
    try {
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        ...values,
        updatedAt: new Date().toISOString()
      });
      await fetchUsers();
      setModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <>
      <Group position="apart" mb="md">
        <Text size="lg" weight={500}>User Management</Text>
      </Group>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.displayName}</td>
              <td>{user.email}</td>
              <td>
                <Badge color={user.role === 'admin' ? 'red' : 'blue'}>
                  {user.role}
                </Badge>
              </td>
              <td>
                <Badge color={user.isActive ? 'green' : 'gray'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <Menu position="bottom-end">
                  <Menu.Target>
                    <ActionIcon>
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item 
                      icon={<IconEdit size={14} />}
                      onClick={() => {
                        setEditingUser(user);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item 
                      icon={<IconLock size={14} />}
                      onClick={() => handleEditUser({
                        ...user,
                        isActive: !user.isActive
                      })}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Menu.Item>
                    <Menu.Item 
                      icon={<IconTrash size={14} />}
                      color="red"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        title="Edit User"
      >
        {editingUser && (
          <Stack>
            <TextInput
              label="Display Name"
              value={editingUser.displayName}
              onChange={(e) => setEditingUser({
                ...editingUser,
                displayName: e.target.value
              })}
            />
            <Select
              label="Role"
              value={editingUser.role}
              onChange={(value) => setEditingUser({
                ...editingUser,
                role: value
              })}
              data={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' }
              ]}
            />
            <Button onClick={() => handleEditUser(editingUser)}>
              Save Changes
            </Button>
          </Stack>
        )}
      </Modal>
    </>
  );
};

export default UserManagement; 