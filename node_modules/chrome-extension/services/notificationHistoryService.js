class NotificationHistoryService {
  constructor() {
    this.MAX_HISTORY = 100; // Keep last 100 notifications
  }

  async addToHistory(notification) {
    try {
      const history = await this.getHistory();
      
      const historyEntry = {
        id: notification.id,
        timestamp: new Date().toISOString(),
        type: notification.type,
        title: notification.title,
        message: notification.message,
        patientInfo: notification.patientInfo,
        status: 'created',
        source: notification.source || 'screen-capture',
        matchConfidence: notification.matchConfidence || 1.0,
        rawText: notification.rawText || '',
        screenRegion: notification.screenRegion || null
      };

      // Add to beginning of array
      history.unshift(historyEntry);

      // Trim to max length
      if (history.length > this.MAX_HISTORY) {
        history.length = this.MAX_HISTORY;
      }

      await chrome.storage.local.set({ notificationHistory: history });
      
      console.log('Added to notification history:', historyEntry);
      return historyEntry;
    } catch (error) {
      console.error('Error adding to notification history:', error);
    }
  }

  async updateHistoryEntry(id, updates) {
    const history = await this.getHistory();
    const index = history.findIndex(entry => entry.id === id);
    
    if (index !== -1) {
      history[index] = {
        ...history[index],
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      await chrome.storage.local.set({ notificationHistory: history });
    }
  }

  async getHistory() {
    const data = await chrome.storage.local.get('notificationHistory');
    return data.notificationHistory || [];
  }

  async clearHistory() {
    await chrome.storage.local.set({ notificationHistory: [] });
  }

  async getHistoryStats() {
    const history = await this.getHistory();
    const now = new Date();
    
    // Time-based metrics
    const last24Hours = history.filter(entry => 
      new Date(entry.timestamp) > new Date(now - 24 * 60 * 60 * 1000)
    ).length;

    const last7Days = history.filter(entry => 
      new Date(entry.timestamp) > new Date(now - 7 * 24 * 60 * 60 * 1000)
    ).length;

    // Calculate success rate
    const successfulMatches = history.filter(entry => entry.matchConfidence > 0.8).length;
    const successRate = (successfulMatches / history.length) * 100;

    // Calculate interaction rate
    const interactedNotifications = history.filter(entry => 
      entry.status === 'clicked_alerts' || entry.status === 'clicked_history'
    ).length;
    const interactionRate = (interactedNotifications / history.length) * 100;

    // Source reliability
    const sourceStats = history.reduce((acc, entry) => {
      if (!acc[entry.source]) {
        acc[entry.source] = {
          total: 0,
          successful: 0,
          averageConfidence: 0
        };
      }
      acc[entry.source].total++;
      if (entry.matchConfidence > 0.8) {
        acc[entry.source].successful++;
      }
      acc[entry.source].averageConfidence += entry.matchConfidence;
      return acc;
    }, {});

    // Calculate averages for each source
    Object.values(sourceStats).forEach(stats => {
      stats.successRate = (stats.successful / stats.total) * 100;
      stats.averageConfidence = (stats.averageConfidence / stats.total) * 100;
    });

    // Time of day analysis
    const hourlyDistribution = new Array(24).fill(0);
    history.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      hourlyDistribution[hour]++;
    });

    // Patient frequency
    const patientFrequency = history.reduce((acc, entry) => {
      const patientId = entry.patientInfo.id;
      acc[patientId] = (acc[patientId] || 0) + 1;
      return acc;
    }, {});

    // Most frequent patients
    const frequentPatients = Object.entries(patientFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => {
        const entry = history.find(e => e.patientInfo.id === id);
        return {
          id,
          name: `${entry.patientInfo.name.given.join(' ')} ${entry.patientInfo.name.family}`,
          count
        };
      });

    return {
      total: history.length,
      recentActivity: {
        last24Hours,
        last7Days,
        averagePerDay: Math.round(last7Days / 7)
      },
      performance: {
        successRate: successRate.toFixed(1),
        interactionRate: interactionRate.toFixed(1),
        averageConfidence: (history.reduce((acc, entry) => acc + entry.matchConfidence, 0) / history.length * 100).toFixed(1)
      },
      byStatus: history.reduce((acc, entry) => {
        acc[entry.status] = (acc[entry.status] || 0) + 1;
        return acc;
      }, {}),
      bySource: sourceStats,
      timeAnalysis: {
        hourlyDistribution,
        peakHour: hourlyDistribution.indexOf(Math.max(...hourlyDistribution)),
        quietHour: hourlyDistribution.indexOf(Math.min(...hourlyDistribution))
      },
      patientAnalysis: {
        uniquePatients: Object.keys(patientFrequency).length,
        frequentPatients,
        averageDetectionsPerPatient: (history.length / Object.keys(patientFrequency).length).toFixed(1)
      },
      errorRate: {
        total: history.filter(entry => entry.status === 'error').length,
        percentage: ((history.filter(entry => entry.status === 'error').length / history.length) * 100).toFixed(1)
      }
    };
  }
}

export default new NotificationHistoryService(); 