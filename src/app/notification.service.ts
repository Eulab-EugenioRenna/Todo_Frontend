import { Message, MessageService } from 'primeng/api';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageService = inject(MessageService);

  constructor() {}

  message$ = new BehaviorSubject<Message>({
    severity: '',
    summary: '',
  });

  addMessage(message: Message) {
    this.message$.next(message);
    this.messageService.add(this.message$.value);
  }

  clear() {
    this.messageService.clear()
  }
}
