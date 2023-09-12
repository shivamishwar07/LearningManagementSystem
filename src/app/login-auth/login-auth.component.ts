import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '.././services/user.service';
@Component({
  selector: 'app-login-auth',
  templateUrl: './login-auth.component.html',
  styleUrls: ['./login-auth.component.css']
})
export class LoginAuthComponent {
  menuType: string = "default"
  authError:undefined|string=''
  constructor(private fb: UntypedFormBuilder,  private route: Router,private user:UserService) { }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
    });
    this.user.reload();
  }
  validateForm!: UntypedFormGroup;
  isLogin: boolean = false;

  submitForm(): void {
    if (this.validateForm.valid) {
      this.user.userLogin(this.validateForm.value)
      this.validateForm.reset();
      this.user.isLoginError.subscribe((isError) => {
        if (isError) {
          this.authError = "Login Failed Check Email or Password"
        }
        else{
          alert("Shi hai")
        }
      })
      setTimeout(()=>
        (this.authError=undefined),1000)
    } 
  }
}
