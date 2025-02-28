import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ZoomMtg } from '@zoomus/websdk';


@Component({
  selector: 'app-join-event',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './join-event.component.html',
  styleUrl: './join-event.component.css'
})
export class JoinEventComponent {
  meetingId: string = '';
  passcode: string = '';
  zoomMeetingUrl: SafeResourceUrl | null = null;
  isModalOpen: boolean = true;

  constructor(private sanitizer: DomSanitizer) {}


  joinMeeting() {
    this.isModalOpen = false;
    if (this.meetingId && this.passcode) {
      const url = `https://us05web.zoom.us/wc/${this.meetingId}/join?pwd=${this.passcode}`;
      this.zoomMeetingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      alert("enter both Meeting ID and Passcode.");
    }
  }
}
