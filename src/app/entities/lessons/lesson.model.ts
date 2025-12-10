// Lecture Model - represents a lecture/class session
// Note: File is named lesson.model.ts for backward compatibility,
// but represents Lecture data from the API

export interface ZoomMeeting {
  id: string;
  zoomMeetingId: number;
  topic: string;
  joinUrl: string;
  startUrl: string;
  password: string;
  startTime: string; // DateTimeOffset
  duration: number; // in minutes
}

export interface ZoomRecording {
  id: string;
  recordingUrl: string;
  duration: string; // TimeSpan format
}

export interface Lecture {
  id: string;
  title: string;
  isRecordedAvailable: boolean;
  scheduledAt: string; // DateTimeOffset
  isCompleted: boolean;
  duration: string; // TimeSpan format
  moduleId: string;
  zoomMeeting?: ZoomMeeting;
  zoomRecording?: ZoomRecording;
}

// Legacy alias for backward compatibility
export type Lesson = Lecture;
