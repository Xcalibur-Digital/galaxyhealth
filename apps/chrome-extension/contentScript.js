// Regular expressions for matching patient identifiers
const PATTERNS = {
  mrn: /(?:MRN|Medical Record Number|Patient ID):\s*(\d{6,})/i,
  name: /(?:Medical Record Dashboard|Patient):\s*([A-Za-z\s\-']+(?:\s*,\s*[A-Za-z\-']+)?)/i,
  dob: /(?:DOB|Date of Birth|Birth Date):\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i
};

// Debounce function to limit processing
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Add a function to clean up extracted text
const cleanText = (text) => {
  return text
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .trim();
};

// Function to extract text from an element and its children
const extractText = (element) => {
  // Handle text nodes
  if (element.nodeType === Node.TEXT_NODE) {
    return element.textContent;
  }
  
  // Skip script and style elements
  if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
    return '';
  }

  // Skip hidden elements
  if (element.offsetParent === null && !element.getAttribute('aria-hidden')) {
    return '';
  }

  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return '';
  }

  // Special handling for headings and labels
  if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'LABEL') {
    console.log('Found heading/label:', element.textContent);
  }

  // Collect text from children
  let text = '';
  for (const child of element.childNodes) {
    text += extractText(child) + ' ';
  }
  return cleanText(text);
};

// Function to extract patient info from text
const extractPatientInfo = (text) => {
  console.log('Analyzing text for patient info:', text);
  const matches = {};
  
  Object.entries(PATTERNS).forEach(([key, pattern]) => {
    const match = text.match(pattern);
    if (match) {
      let value = match[1].trim();
      
      // Special handling for names
      if (key === 'name') {
        // Handle "LastName, FirstName" format
        if (value.includes(',')) {
          const [lastName, firstName] = value.split(',').map(part => part.trim());
          value = `${firstName} ${lastName}`;
        }
        console.log(`Found patient name: ${value}`);
      }
      
      matches[key] = value;
      console.log(`Found ${key}:`, matches[key]);
    }
  });

  // Additional check for dashboard title
  const dashboardMatch = text.match(/Medical Record Dashboard.*?([A-Za-z\s\-']+)/i);
  if (dashboardMatch && !matches.name) {
    matches.name = dashboardMatch[1].trim();
    console.log('Found name from dashboard:', matches.name);
  }

  return matches;
};

// Process mutations to detect patient information
const processMutations = debounce((mutations) => {
  console.log('Processing DOM mutations');
  
  // Get text from the entire document
  const text = extractText(document.body);
  console.log('Extracted text:', text);
  
  // Try to find patient info
  const patientInfo = extractPatientInfo(text);
  
  if (Object.keys(patientInfo).length > 0) {
    console.log('Patient info detected:', patientInfo);
    
    // Format the data for FHIR
    const fhirPatient = {
      resourceType: 'Patient',
      id: patientInfo.mrn || `generated-${Date.now()}`,
      name: [{
        given: [patientInfo.name.split(' ')[0]],
        family: patientInfo.name.split(' ').slice(1).join(' ')
      }],
      identifier: patientInfo.mrn ? [{
        system: 'http://hospital.org/mrn',
        value: patientInfo.mrn
      }] : undefined
    };

    // Send to background script
    chrome.runtime.sendMessage({
      type: 'PATIENT_DETECTED',
      data: {
        ...fhirPatient,
        source: 'browser',
        appName: document.title || window.location.hostname
      }
    });
  }
}, 1000);

// Create and start the observer
const observer = new MutationObserver(processMutations);

// Start observing
console.log('Starting patient monitoring...');
observer.observe(document.body, {
  childList: true,
  characterData: true,
  subtree: true
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  if (message.type === 'START_MONITORING') {
    console.log('Starting patient monitoring...');
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true
    });
  } else if (message.type === 'STOP_MONITORING') {
    console.log('Stopping patient monitoring...');
    observer.disconnect();
  }
}); 