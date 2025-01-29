document.getElementById('testDetection').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {type: 'TEST_DETECTION'});
  });
});

let monitoring = false;
const toggleBtn = document.getElementById('toggleMonitoring');

toggleBtn.addEventListener('click', () => {
  monitoring = !monitoring;
  toggleBtn.textContent = monitoring ? 'Stop Monitoring' : 'Start Monitoring';
  
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: monitoring ? 'START_MONITORING' : 'STOP_MONITORING'
    });
  });
}); 