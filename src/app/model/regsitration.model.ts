export interface Registration {
    id?: string; 
    name: string;
    email: string;
    instituteName: string;
    course: string;
    teammates?: string[]; 
    username?: string; 
    eventId?: string; 
}
