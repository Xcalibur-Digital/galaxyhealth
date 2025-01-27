import { db } from '../config/firebase.js';

export const storageService = {
  // Audit Logs
  async logAuditEvent(event) {
    try {
      const auditRef = db.collection('auditLogs');
      const docRef = auditRef.doc();
      await docRef.set({
        ...event,
        timestamp: new Date().toISOString(),
        id: docRef.id
      });
      return docRef.id;
    } catch (error) {
      console.error('Error logging audit event:', error);
      throw error;
    }
  },

  // User Management
  async updateUserStatus(userId, status) {
    try {
      const userRef = db.collection('users').doc(userId);
      await userRef.update({
        accountStatus: status,
        statusUpdatedAt: new Date().toISOString(),
        isActive: status === 'active',
        lastUpdated: new Date().toISOString()
      });

      await this.logAuditEvent({
        type: 'USER_STATUS_UPDATE',
        userId,
        details: {
          newStatus: status,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  // System Events
  async logSystemEvent(eventType, details) {
    try {
      const systemLogsRef = db.collection('systemLogs');
      const docRef = systemLogsRef.doc();
      await docRef.set({
        type: eventType,
        details,
        timestamp: new Date().toISOString(),
        id: docRef.id
      });
      return docRef.id;
    } catch (error) {
      console.error('Error logging system event:', error);
      throw error;
    }
  },

  // Error Logging
  async logError(error, context = {}) {
    try {
      const errorLogsRef = db.collection('errorLogs');
      const docRef = errorLogsRef.doc();
      await docRef.set({
        error: {
          message: error.message,
          stack: error.stack,
          code: error.code
        },
        context,
        timestamp: new Date().toISOString(),
        id: docRef.id
      });
      return docRef.id;
    } catch (logError) {
      console.error('Error logging error:', logError);
      throw logError;
    }
  }
};

export default storageService; 