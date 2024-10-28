import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../core/service/user/user.service';
import { UserDTO } from '../../core/model/userDTO.model';
import Swal from 'sweetalert2'; 


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: any;
  registerForm: any;
  activeForm: 'login' | 'register' = 'login';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      userName: ['', Validators.required], // Ensure this matches your UserDTO
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  toggleForm(form: 'login' | 'register') {
    this.activeForm = form;
  }

  login() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.userService.login(loginData).subscribe({
        next: (response: any) => {
          // Handle success response, assume token or user data is returned
          console.log("Login success:", response);
          
          // Save token to localStorage or sessionStorage if needed
          localStorage.setItem('token', response.token);

          // Navigate to the dashboard
          this.router.navigate(['/budget-planner/dashboard']);
        },
        error: (error) => {
          console.error("Login error:", error);
          this.snackBar.open('Invalid email or password!', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Invalid email or password!', 'Close', { duration: 3000 });
    }
  }

  // register() {
  //   if (this.registerForm.valid) {
  //     const userData: UserDTO = this.registerForm.value;
  
  //     this.userService.register(userData).subscribe(
  //       response => {
  //         console.log('Registration successful:', response);
  //         this.router.navigate(['/budget-planner/login']);
  //         this.snackBar.open('Registration successful! Please log in.', 'Close', { duration: 3000 });
  //       },
  //       error => {
  //         console.error('Registration failed:', error);
  //         // Log the entire error response for better debugging
  //         if (error.error && error.error.message) {
  //           this.snackBar.open(error.error.message, 'Close', { duration: 3000 });
  //         } else {
  //           this.snackBar.open('Registration failed. Please try again.', 'Close', { duration: 3000 });
  //         }
  //       }
  //     );
  //   } else {
  //     this.snackBar.open('Please fill in all fields correctly!', 'Close', { duration: 3000 });
  //   }
  // }
  

register() {
    if (this.registerForm.valid) {
        const userData: UserDTO = this.registerForm.value;

        this.userService.register(userData).subscribe(
            response => {
                console.log('Registration successful:', response);
                this.router.navigate(['/budget-planner/dashboard']); // Correct path for navigation
                // Show success alert
                Swal.fire({
                    title: 'Registration Successful!',
                    text: 'Please log in to continue.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            },
            error => {
                console.error('Registration failed:', error);
                // Show error alert
                let errorMessage = 'Registration failed. Please try again.';
                if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                }
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Close'
                });
            }
        );
    } else {
        Swal.fire({
            title: 'Warning!',
            text: 'Please fill in all fields correctly!',
            icon: 'warning',
            confirmButtonText: 'Close'
        });
    }
}

  
}
