class NotificationService {
  constructor() {
    this.hasPermission = false;
    this.soundEnabled = true;
    this.desktopEnabled = true;
    this.loadPreferences();
  }

  async loadPreferences() {
    const result = await chrome.storage.sync.get({
      notificationSound: true,
      desktopNotifications: true
    });
    
    this.soundEnabled = result.notificationSound;
    this.desktopEnabled = result.desktopNotifications;
  }

  async requestPermission() {
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    }
    this.hasPermission = true;
    return true;
  }

  async showNotification(patient, options = {}) {
    const defaultOptions = {
      requireInteraction: true,
      silent: !this.soundEnabled
    };

    const notificationOptions = {
      ...defaultOptions,
      ...options,
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Patient Context Detected',
      message: `Found matching patient: ${patient.name[0].given.join(' ')} ${patient.name[0].family}`,
      buttons: [{ title: 'View Alerts' }]
    };

    // Create unique ID
    const notificationId = `patient-${patient.id}-${Date.now()}`;

    // Show Chrome notification
    chrome.notifications.create(notificationId, notificationOptions);

    // Show desktop notification if enabled
    if (this.desktopEnabled && this.hasPermission) {
      const notification = new Notification(notificationOptions.title, {
        body: notificationOptions.message,
        icon: notificationOptions.iconUrl,
        tag: notificationId,
        requireInteraction: notificationOptions.requireInteraction,
        silent: notificationOptions.silent
      });

      notification.onclick = () => {
        chrome.tabs.create({
          url: `https://galaxyhealth.web.app/ehr-alerts?patientId=${patient.id}`
        });
      };
    }

    return notificationId;
  }

  async updatePreferences(preferences) {
    await chrome.storage.sync.set(preferences);
    await this.loadPreferences();
  }
}

export default new NotificationService(); 