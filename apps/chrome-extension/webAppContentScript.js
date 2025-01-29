// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PATIENT_CONTEXT_UPDATED') {
    console.log('Received patient context in web app:', message.data);
    
    // Forward to web app via window.postMessage
    window.postMessage({
      type: 'PATIENT_CONTEXT_UPDATED',
      data: message.data
    }, '*');
  }
}); 