import { NotificationService } from './../../../notification.service';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { UserDto } from '../../../model/UserDto';
import { AuthService } from '../../../auth.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { EMPTY, catchError, of, switchMap, tap } from 'rxjs';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    DialogModule,
    MessagesModule,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WelcomeComponent {
  user?: UserDto;
  private authService = inject(AuthService);
  private router = inject(Router);
  private primengConfig = inject(PrimeNGConfig);
  private notificationService = inject(NotificationService);

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  errorLogin = false;

  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  visibleLogin!: boolean;

  showLoginModal() {
    this.visibleLogin = true;
  }

  login() {
    this.authService
      .login$(this.loginForm.value)
      .pipe(
        switchMap(() => this.authService.getSignedUser$()),
        tap((data) => {
          this.user = data;
          this.visibleLogin = false;
        }),
        catchError((error) => {
          this.notificationService.addMessage({
            severity: 'error',
            summary: 'Data not valid',
            detail: error.error.message,
          });
          this.visibleLogin = false;
          return of(null); // Restituisci un observable nullo per continuare la catena
        })
      )
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }

  registerForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required]),
  });

  visibleRegister!: boolean;
  showRegisterModal() {
    this.visibleRegister = true;
  }

  register() {
    this.authService
      .signup$(this.registerForm.value)
      .pipe(
        tap((data) => console.log(data)),
        catchError((error) => {
          console.log(error);
          this.notificationService.addMessage({
            severity: 'error',
            summary: 'Data not valid',
            detail: error.error.message,
          });
          return EMPTY;
        })
      )
      .subscribe((data) => {
        this.notificationService.addMessage({
          severity: 'success',
          summary: 'Sign Up Completed',
        });
        this.visibleRegister = false;
      });
  }
}
