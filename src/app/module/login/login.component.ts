import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
loginForm:any;
registerForm:any;
activeForm: 'login' | 'register' = 'login';

constructor( private fb: FormBuilder,
  private http: HttpClient,
  private router: Router,
  private snackBar: MatSnackBar){}
ngOnInit() {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  this.registerForm = this.fb.group({
    username: ['', Validators.required],
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

    this.http.post('http://localhost:3000/api/login', loginData).subscribe({
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
register() {
  if (this.registerForm.valid) {
    console.log("Register info==>>", this.registerForm.value);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    this.router.navigate(['/budget-planner/login']);
  } else {
    this.snackBar.open('Please fill in all fields correctly!', 'Close', { duration: 3000 });
  }
}


}
