import { Component, inject } from '@angular/core';
import { MessagesModule } from 'primeng/messages';
import { NotificationService } from '../../notification.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MessagesModule, ButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private notificationService = inject(NotificationService);
  clearNotification() {
    this.notificationService.clear();
  }
}
