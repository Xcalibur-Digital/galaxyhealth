class ScreenCaptureService {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
  }

  async initialize() {
    try {
      // Request screen capture
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'never',
          displaySurface: 'monitor'
        }
      });

      // Set up video element
      this.videoElement = document.createElement('video');
      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();

      // Set canvas dimensions
      this.canvas.width = this.videoElement.videoWidth;
      this.canvas.height = this.videoElement.videoHeight;

      return true;
    } catch (error) {
      console.error('Failed to initialize screen capture:', error);
      return false;
    }
  }

  async captureScreen() {
    if (!this.stream || !this.videoElement) {
      throw new Error('Screen capture not initialized');
    }

    // Draw video frame to canvas
    this.context.drawImage(
      this.videoElement, 
      0, 
      0, 
      this.canvas.width, 
      this.canvas.height
    );

    // Get image data
    return this.canvas.toDataURL('image/jpeg', 0.8);
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
  }
}

export default ScreenCaptureService; 