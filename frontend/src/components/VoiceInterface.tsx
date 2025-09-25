import React, { useState, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Volume2 } from 'lucide-react';
import { apiService } from '../services/api';

const VoiceInterface: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
      const result = await apiService.speechToText(audioFile);
      
      setTranscription(result.text);
      
      const response = generateResponse(result.text);
      setResponseText(response);
      
      await textToSpeech(response);
    } catch (error) {
      console.error('Error processing audio:', error);
      setTranscription('Error processing audio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateResponse = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('inventory') || lowerText.includes('stock')) {
      return 'I can help you check inventory levels. What specific item would you like to know about?';
    } else if (lowerText.includes('receipt') || lowerText.includes('delivery')) {
      return 'I can help you process a new receipt. Please provide the supplier and items delivered.';
    } else if (lowerText.includes('production') || lowerText.includes('recipe')) {
      return 'I can help you start a production run. Which recipe would you like to produce?';
    } else if (lowerText.includes('wastage') || lowerText.includes('waste')) {
      return 'I can help you record wastage. Please specify the item and reason for wastage.';
    } else if (lowerText.includes('transfer')) {
      return 'I can help you create a transfer between sites. Which sites are involved?';
    } else if (lowerText.includes('count')) {
      return 'I can help you perform a cycle count. Which location would you like to count?';
    } else {
      return 'I understand you said: "' + text + '". How can I help you with your catering stock management today?';
    }
  };

  const textToSpeech = async (text: string) => {
    try {
      const audioBlob = await apiService.textToSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  };

  const playResponse = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const pauseResponse = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Voice Interface</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-white font-medium transition-colors ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {isRecording ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </button>
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">
              {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Speak naturally about your catering stock management needs
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Processing audio...</span>
            </div>
          )}
        </div>
      </div>

      {transcription && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">What you said:</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800">{transcription}</p>
          </div>
        </div>
      )}

      {responseText && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Response:</h3>
            <div className="flex space-x-2">
              <button
                onClick={isPlaying ? pauseResponse : playResponse}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Play
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-800">{responseText}</p>
          </div>
          <audio ref={audioRef} className="hidden" />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Voice Commands</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Volume2 className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-gray-700">"Check inventory for milk"</span>
            </div>
            <div className="flex items-center">
              <Volume2 className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-gray-700">"Process delivery from supplier"</span>
            </div>
            <div className="flex items-center">
              <Volume2 className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-gray-700">"Start production run"</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Volume2 className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-gray-700">"Record wastage"</span>
            </div>
            <div className="flex items-center">
              <Volume2 className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-gray-700">"Create transfer"</span>
            </div>
            <div className="flex items-center">
              <Volume2 className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-gray-700">"Perform cycle count"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;
