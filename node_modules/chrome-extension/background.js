import { searchFHIRPatient } from './fhirService.js';
import ScreenCaptureService from './services/screenCapture.js';
import OCRService from './services/ocrService.js';
import notificationHistoryService from './services/notificationHistoryService.js';
import StorageService from './services/storageService.js';

// Keep track of current patient context
let currentPatientContext = null;
let monitoringTab = null;
let screenCapture = null;
let ocrService = null;
let monitoringInterval = null;

// Request notification permission on startup
chrome.runtime.onInstalled.addListener(() => {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
});

// Function to show desktop notification
const showDesktopNotification = async (patient, context = {}) => {
  const notificationId = `patient-${patient.id}-${Date.now()}`;
  
  const notificationData = {
    id: notificationId,
    type: 'PATIENT_CONTEXT',
    title: 'Patient Context Detected',
    message: `Found matching patient: ${patient.name[0].given.join(' ')} ${patient.name[0].family}`,
    patientInfo: {
      id: patient.id,
      name: patient.name[0],
      mrn: patient.identifier?.[0]?.value
    },
    source: context.source || 'browser',
    appName: context.appName || document.title || window.location.hostname,
    timestamp: new Date().toISOString(),
    read: false
  };

  // Add to notification store
  await StorageService.addNotification(notificationData);

  // Show notifications
  const options = {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: notificationData.title,
    message: notificationData.message,
    buttons: [
      { title: 'View Alerts' },
      { title: 'View History' }
    ],
    requireInteraction: true,
    silent: false
  };

  chrome.notifications.create(notificationId, options);

  if (Notification.permission === 'granted') {
    const notification = new Notification(options.title, {
      body: options.message,
      icon: options.iconUrl,
      tag: notificationId,
      requireInteraction: true,
      silent: false
    });

    notification.onclick = () => {
      chrome.tabs.create({
        url: `https://galaxyhealth.web.app/ehr-alerts?patientId=${patient.id}`
      });
    };
  }

  return notificationId;
};

// Initialize services
async function initializeServices() {
  screenCapture = new ScreenCaptureService();
  ocrService = new OCRService();

  const screenInitialized = await screenCapture.initialize();
  const ocrInitialized = await ocrService.initialize();

  return screenInitialized && ocrInitialized;
}

// Monitor screen function
async function monitorScreen() {
  try {
    // Capture screen
    const imageData = await screenCapture.captureScreen();
    
    // Process with OCR
    const text = await ocrService.processImage(imageData);
    
    // Extract patient info
    const patientInfo = extractPatientInfo(text);
    
    if (Object.keys(patientInfo).length > 0) {
      // Search FHIR store for matching patient
      const matchedPatient = await searchFHIRPatient(patientInfo);
      
      if (matchedPatient && matchedPatient.id !== currentPatientContext?.id) {
        currentPatientContext = matchedPatient;
        
        // Show desktop notification
        await showDesktopNotification(matchedPatient);
        
        // Notify web app
        notifyWebApp(matchedPatient);
      }
    }
  } catch (error) {
    console.error('Screen monitoring error:', error);
  }
}

// Start/stop monitoring
chrome.action.onClicked.addListener(async (tab) => {
  if (monitoringInterval) {
    // Stop monitoring
    clearInterval(monitoringInterval);
    monitoringInterval = null;
    screenCapture?.stop();
    await ocrService?.terminate();
    chrome.action.setIcon({ path: 'icons/icon16.png' });
  } else {
    // Start monitoring
    const initialized = await initializeServices();
    if (initialized) {
      monitoringInterval = setInterval(monitorScreen, 5000); // Check every 5 seconds
      chrome.action.setIcon({ path: 'icons/icon16-active.png' });
    }
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === 'PATIENT_DETECTED') {
    const patientInfo = message.data;
    
    try {
      // Search FHIR store for matching patient
      const matchedPatient = await searchFHIRPatient(patientInfo);
      
      if (matchedPatient && matchedPatient.id !== currentPatientContext?.id) {
        currentPatientContext = matchedPatient;
        
        // Show desktop notification
        await showDesktopNotification(matchedPatient);
        
        // Notify web app
        notifyWebApp(matchedPatient);
      }
    } catch (error) {
      console.error('Error processing patient context:', error);
    }
  }
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
  if (buttonIndex === 0 && currentPatientContext) {
    // View alerts
    chrome.tabs.create({
      url: `https://galaxyhealth.web.app/ehr-alerts?patientId=${currentPatientContext.id}`
    });
    await notificationHistoryService.updateHistoryEntry(notificationId, { status: 'clicked_alerts' });
  } else if (buttonIndex === 1) {
    // View history
    chrome.tabs.create({
      url: chrome.runtime.getURL('history.html')
    });
    await notificationHistoryService.updateHistoryEntry(notificationId, { status: 'clicked_history' });
  }
});

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  if (currentPatientContext) {
    // Open web app to patient alerts
    chrome.tabs.create({
      url: `https://galaxyhealth.web.app/ehr-alerts?patientId=${currentPatientContext.id}`
    });
  }
});

// Function to notify web app
const notifyWebApp = async (patient) => {
  try {
    console.log('Attempting to notify web app with patient:', patient);
    
    // Find Galaxy Health web app tabs
    const tabs = await chrome.tabs.query({
      url: '*://*.galaxyhealth.web.app/*'
    });
    
    console.log('Found web app tabs:', tabs);

    if (tabs.length === 0) {
      console.log('No Galaxy Health web app tabs found');
      return;
    }

    // Send message to each tab
    for (const tab of tabs) {
      try {
        console.log('Sending message to tab:', tab.id);
        await chrome.tabs.sendMessage(tab.id, {
          type: 'PATIENT_CONTEXT_UPDATED',
          data: patient
        });
        console.log('Successfully sent message to tab:', tab.id);
      } catch (error) {
        console.error('Error sending to tab:', tab.id, error);
      }
    }
  } catch (error) {
    console.error('Error in notifyWebApp:', error);
  }
}; 