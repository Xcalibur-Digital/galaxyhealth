import { createWorker } from 'tesseract.js';

class OCRService {
  constructor() {
    this.worker = null;
  }

  async initialize() {
    try {
      this.worker = await createWorker();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
      console.log('OCR service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize OCR:', error);
      return false;
    }
  }

  async processImage(imageData) {
    if (!this.worker) {
      throw new Error('OCR service not initialized');
    }

    try {
      const { data: { text } } = await this.worker.recognize(imageData);
      return text;
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw error;
    }
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export default OCRService; 