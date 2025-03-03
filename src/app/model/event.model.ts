export interface Event {
  id?: string;
  title: string;
  type: string;
  description: string;
  eventDate: Date; 
  eventTime: string; 
  eventDuration: number;
  registrationDeadline: Date;
  eventMode: string;
  contactDetails: string;
  location?: string; 
  fee?: number; 
  minParticipants: number;
  maxParticipants?: number; 
  instituteName: string;
  meetUrl?: string; 
  meetId?: string; 
  meetPasscode?: string;
  creatorEmail: string;
  createdBy?: string;
  status?: string;
  registeredCount?: number;
}
