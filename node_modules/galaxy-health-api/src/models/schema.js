const USER_SCHEMA = {
  users: {
    $uid: {
      // Basic profile (synced with Firebase Auth)
      uid: 'string',
      email: 'string',
      displayName: 'string',
      photoURL: 'string?',

      // Role information
      role: {
        type: 'string',
        enum: ['nurse', 'physician', 'practice_staff', 'analyst'],
        required: true
      },

      // Role metadata
      roleAssignedAt: 'timestamp',
      roleAssignedBy: 'string', // UID of admin who assigned role
      previousRoles: [{
        role: 'string',
        assignedAt: 'timestamp',
        removedAt: 'timestamp',
        assignedBy: 'string',
        removedBy: 'string'
      }],

      // Access control
      permissions: ['string'],
      restrictedAccess: 'boolean',
      
      // Audit trail
      createdAt: 'timestamp',
      lastUpdated: 'timestamp',
      lastLogin: 'timestamp',
      
      // Profile status
      isActive: 'boolean',
      profileComplete: 'boolean',
      
      // Professional details
      professionalId: 'string?', // e.g., medical license number
      specialties: ['string'],
      department: 'string?',
      
      // Contact & Organization
      contactNumber: 'string?',
      organization: {
        id: 'string',
        name: 'string',
        department: 'string?',
        role: 'string?'
      }
    }
  },

  roles: {
    $roleId: {
      name: 'string',
      description: 'string',
      permissions: ['string'],
      createdAt: 'timestamp',
      lastUpdated: 'timestamp',
      isActive: 'boolean',
      metadata: {
        requiresApproval: 'boolean',
        approvalWorkflow: 'string?',
        restrictions: ['string']
      }
    }
  },

  roleAssignments: {
    $assignmentId: {
      userId: 'string',
      roleId: 'string',
      assignedAt: 'timestamp',
      assignedBy: 'string',
      expiresAt: 'timestamp?',
      status: {
        type: 'string',
        enum: ['active', 'expired', 'revoked']
      },
      metadata: {
        reason: 'string?',
        approvedBy: 'string?',
        approvedAt: 'timestamp?'
      }
    }
  }
};

module.exports = {
  USER_SCHEMA
}; 