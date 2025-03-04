import { Component } from '@angular/core';
import { AdminApiService } from '../admin-api.service';
import { Feedback } from '../../model/feedback.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {

  feedbacks: Feedback[] = [];

  constructor(private adminApi: AdminApiService) {}

  ngOnInit() {
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.adminApi.getFeedback().subscribe({
      next: (data) => {
        this.feedbacks = data;
      }
    })
  }

}
