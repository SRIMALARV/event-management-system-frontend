export interface Event {
    id?: string;
    title: string;
    type: string;
    description: string;
    eventDate: Date;
    registrationDeadline: Date;
    eventMode: string;
    contactDetails: string;
    location?: string;
    fee?: number;
    minParticipants: number;
    maxParticipants?: number;
    instituteName: string;
    imageUrl?: string;
  }