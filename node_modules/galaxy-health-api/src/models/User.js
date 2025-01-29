import admin from 'firebase-admin';
import { db } from '../config/firebase.js';

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.displayName = data.displayName;
    this.photoURL = data.photoURL;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.ref = db.collection('users').doc(this.id);
  }

  static async findById(id) {
    try {
      const doc = await db.collection('users').doc(id).get();
      if (!doc.exists) return null;
      return new User({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  static async create(userData) {
    const { uid } = userData;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const userDoc = {
      ...userData,
      createdAt: timestamp,
      lastUpdated: timestamp,
      isActive: true,
      profileComplete: false
    };

    await db.collection('users').doc(uid).set(userDoc);
    return new User({ id: uid, ...userDoc });
  }

  async updateRole(role, adminUid) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const userDoc = await this.ref.get();
    const userData = userDoc.data();

    // Store previous role if it exists
    const previousRoles = userData.previousRoles || [];
    if (userData.role) {
      previousRoles.push({
        role: userData.role,
        assignedAt: userData.roleAssignedAt,
        removedAt: timestamp,
        assignedBy: userData.roleAssignedBy,
        removedBy: adminUid
      });
    }

    // Update role
    await this.ref.update({
      role,
      roleAssignedAt: timestamp,
      roleAssignedBy: adminUid,
      previousRoles,
      lastUpdated: timestamp
    });

    // Create role assignment record
    await db.collection('roleAssignments').add({
      userId: this.uid,
      roleId: role,
      assignedAt: timestamp,
      assignedBy: adminUid,
      status: 'active'
    });

    return this.get();
  }

  async get() {
    const doc = await this.ref.get();
    return doc.data();
  }

  async update(updates) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    await this.ref.update({
      ...updates,
      lastUpdated: timestamp
    });
    return this.get();
  }

  static async getByRole(role) {
    const snapshot = await db.collection('users')
      .where('role', '==', role)
      .where('isActive', '==', true)
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  async getRoleHistory() {
    const doc = await this.ref.get();
    const userData = doc.data();
    return {
      currentRole: {
        role: userData.role,
        assignedAt: userData.roleAssignedAt,
        assignedBy: userData.roleAssignedBy
      },
      previousRoles: userData.previousRoles || []
    };
  }
}

export default User; 