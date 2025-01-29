import notificationHistoryService from './services/notificationHistoryService.js';

async function displayHistory() {
  const history = await notificationHistoryService.getHistory();
  const stats = await notificationHistoryService.getHistoryStats();
  
  // Display enhanced stats
  document.getElementById('stats').innerHTML = `
    <h3>Notification Statistics</h3>
    
    <div class="stats-grid">
      <div class="stats-card">
        <h4>Recent Activity</h4>
        <ul>
          <li>Last 24 Hours: ${stats.recentActivity.last24Hours}</li>
          <li>Last 7 Days: ${stats.recentActivity.last7Days}</li>
          <li>Average Per Day: ${stats.recentActivity.averagePerDay}</li>
        </ul>
      </div>

      <div class="stats-card">
        <h4>Performance</h4>
        <ul>
          <li>Success Rate: ${stats.performance.successRate}%</li>
          <li>Interaction Rate: ${stats.performance.interactionRate}%</li>
          <li>Average Confidence: ${stats.performance.averageConfidence}%</li>
        </ul>
      </div>

      <div class="stats-card">
        <h4>Source Analysis</h4>
        ${Object.entries(stats.bySource).map(([source, data]) => `
          <div class="source-stat">
            <strong>${source}</strong>
            <ul>
              <li>Success Rate: ${data.successRate.toFixed(1)}%</li>
              <li>Average Confidence: ${data.averageConfidence.toFixed(1)}%</li>
              <li>Total Detections: ${data.total}</li>
            </ul>
          </div>
        `).join('')}
      </div>

      <div class="stats-card">
        <h4>Time Analysis</h4>
        <p>Peak Activity: ${stats.timeAnalysis.peakHour}:00</p>
        <p>Quiet Period: ${stats.timeAnalysis.quietHour}:00</p>
        <div class="hour-chart">
          ${stats.timeAnalysis.hourlyDistribution.map((count, hour) => `
            <div class="hour-bar" style="height: ${count * 2}px" title="${hour}:00 - ${count} notifications"></div>
          `).join('')}
        </div>
      </div>

      <div class="stats-card">
        <h4>Patient Analysis</h4>
        <p>Unique Patients: ${stats.patientAnalysis.uniquePatients}</p>
        <p>Avg Detections/Patient: ${stats.patientAnalysis.averageDetectionsPerPatient}</p>
        <h5>Most Frequent:</h5>
        <ul>
          ${stats.patientAnalysis.frequentPatients.map(patient => `
            <li>${patient.name} (${patient.count} detections)</li>
          `).join('')}
        </ul>
      </div>

      <div class="stats-card">
        <h4>Error Analysis</h4>
        <p>Total Errors: ${stats.errorRate.total}</p>
        <p>Error Rate: ${stats.errorRate.percentage}%</p>
      </div>
    </div>
  `;

  // Display history
  document.getElementById('history').innerHTML = history
    .map(entry => `
      <div class="history-entry">
        <div class="timestamp">${new Date(entry.timestamp).toLocaleString()}</div>
        <h3>${entry.title}</h3>
        <p>${entry.message}</p>
        <div class="patient-info">
          <strong>Patient Info:</strong><br>
          ID: ${entry.patientInfo.id}<br>
          Name: ${entry.patientInfo.name.given.join(' ')} ${entry.patientInfo.name.family}<br>
          MRN: ${entry.patientInfo.mrn || 'N/A'}
        </div>
        <p>Status: ${entry.status}</p>
        <p>Source: ${entry.source}</p>
        <p>Match Confidence: ${(entry.matchConfidence * 100).toFixed(1)}%</p>
        ${entry.rawText ? `<details>
          <summary>Raw Text</summary>
          <pre>${entry.rawText}</pre>
        </details>` : ''}
      </div>
    `)
    .join('');
}

displayHistory(); 