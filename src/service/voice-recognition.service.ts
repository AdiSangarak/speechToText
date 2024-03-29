import { Injectable } from '@angular/core';

// Declare the webkitSpeechRecognition variable
declare var webkitSpeechRecognition: any;

/**
 * Service for voice recognition.
 */
@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  recognition = new webkitSpeechRecognition(); // Create a new instance of webkitSpeechRecognition
  isStoppedSpeechRecog = false; // Flag to indicate if speech recognition is stopped
  public text = ''; // Variable to store the recognized text
  tempWords: string = ''; // Temporary variable to store interim recognized words

  constructor() { }

  /**
   * Initializes the voice recognition service.
   */
  init() {
    this.recognition.interimResults = true; // Enable interim results to get real-time updates
    this.recognition.lang = 'en-US'; // Set the language for recognition

    // Add an event listener for the 'result' event
    this.recognition.addEventListener('result', (e: any) => {
      // Extract the transcript from the recognition results
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      this.tempWords = transcript; // Store the interim recognized words
      console.log(transcript); // Log the transcript to the console
    });
  }

  /**
   * Starts the voice recognition.
   */
  start() {
    this.isStoppedSpeechRecog = false; // Set the flag to indicate that speech recognition is not stopped
    this.recognition.start(); // Start the recognition
    console.log("Speech recognition started");
    
    // Add an event listener for the 'end' event
    this.recognition.addEventListener('end', () => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop(); // Stop the recognition if it is explicitly stopped
        console.log("End speech recognition");
      } else {
        this.wordConcat(); // Concatenate the recognized words to the text
        this.recognition.start(); // Start the recognition again for continuous recognition
      }
    });
  }

  /**
   * Stops the voice recognition.
   */
  stop() {
    this.isStoppedSpeechRecog = true; // Set the flag to indicate that speech recognition is stopped
    this.wordConcat(); // Concatenate the recognized words to the text
    this.recognition.stop(); // Stop the recognition
    console.log("End speech recognition");
  }

  /**
   * Concatenates the recognized words to the text.
   */
  wordConcat() {
    this.text = this.text + ' ' + this.tempWords + '.'; // Concatenate the interim recognized words to the text
    this.tempWords = ''; // Clear the temporary variable
  }

}