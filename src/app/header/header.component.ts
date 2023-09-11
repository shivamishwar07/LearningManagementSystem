import { Component,EventEmitter,Input, Output} from '@angular/core';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzPlacementType } from 'ng-zorro-antd/dropdown';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
 @Input() menuType:string='' 
 @Output() displayForm:EventEmitter<any> = new EventEmitter();
  isUVisible: boolean=false;
  constructor(
    private route: Router, private fb: UntypedFormBuilder, private modal: NzModalService, private user: UserService
  ) { }
  isVisible = false;
  isOkLoading = false;
  confirmModal?: NzModalRef;
  listOfPosition: NzPlacementType[] = ['bottomCenter'];
  // menuType: string = "user"
  userName: any;
  showAppForm: boolean = false;
  validateForm!: UntypedFormGroup;
  userEmail: string = "";
  userPassword: string = "";
  userNmeVal: string = "";
  userDataVal: any
  updatedMessage: string | undefined = ""
  errorMessage: string | undefined = ""

  ngOnInit(): void {
    const userData = localStorage.getItem('user')
    if (userData) {
      this.userDataVal = JSON.parse(userData)
      this.userEmail = this.userDataVal.email;
      this.userPassword = this.userPassword;
    }
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      fName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      cPassword: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      phoneNumber: [null, [Validators.required]],
      userCourse: [null, [Validators.required]],
      userSub: [null, [Validators.required]],
      Timing: [null, [Validators.required]],
    });
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('user') && val.url.includes('user')) {
          this.menuType = "user"
          if (localStorage.getItem('user')) {
            let userStore = localStorage.getItem('user')
            let userData = userStore && JSON.parse(userStore);
            this.userName = userData.name;
          }
        }
        else {
          this.menuType = "default"
        }
      }
    })
  }
  showConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Are you sure?',
      nzOnOk: () => {
        let user: string | null = localStorage.getItem('user');
        localStorage.removeItem('user');
        this.route.navigate(['/']);
      }
    });

  }
  savePasswordConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Are you sure?',
      nzOnOk: () => {
        // this.user.updatePassword(this.validateForm.value).subscribe(()=>{
        //   this.updatedMessage = "Password Changed Sucessfully"
        // })const userData = localStorage.getItem('user')

        this.resetData();
        setTimeout(() => {
          this.updatedMessage = undefined;
        }, 2000);
      }
    });
  }
  showModal(): void {
    this.isVisible = true;
  }

  userLogout() {
    this.showConfirm()
  }
  handleOk(): void {
    this.isOkLoading = true;
    this.isVisible = false;
    this.isOkLoading = false;
  }
  handleCancel(): void {
    this.isVisible = false;
  }




  submitForm(): void {
    if (this.validateForm.valid) {
      if (this.userDataVal) {

      }
      if (this.validateForm.value.cPassword === this.userPassword) {
        if (this.validateForm.value.password === this.userPassword) {
          this.errorMessage = "Current password and new password cannot be same"
          this.resetData()
        }
        else
          this.savePasswordConfirm();
        console.log(this.validateForm.value);

      }
      else {
        this.errorMessage = "Current password is incorrect"
        this.resetData()
      }
      setTimeout(() => {
        this.errorMessage = undefined;
      }, 3000);

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls['checkPassword'].updateValueAndValidity());
  }
  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  resetData() {
    this.validateForm.reset();
  }
  updatePassword(currentPassword: string) {

  }
  getFaculty() {
    this.route.navigate(['faculty'])
    this.menuType = "faculty"
  }
  getStudent() {
    this.route.navigate(['student'])
    this.menuType = "students"
  }
  userDataa() {
    console.log(this.menuType);
  }

  studentData(){
    this.route.navigate(['/student'])
    this.menuType='user'
    console.log(this.menuType);
  }
  addStudent(): void {
    this.displayForm.emit();
  }
  updateStudent(): void {
    this.route.navigate(['/updateStudent'])
  }
  facultyData(){
    this.route.navigate(['/faculty'])
    console.log("This is student tab");
  }
  addFaculty(): void {
    this.route.navigate(['/userHome'])
  }
  updateFaculty(): void {
    this.isUVisible = true;
  }
  attendenceData(){
    this.route.navigate(['/attendence'])
    console.log("This is student tab");
  }
  seeAttendence(): void {
    this.isVisible = true;
  }
  Data(){
    this.route.navigate(['/data'])
    console.log("This is student tab");
  }
  showData(){
    
  }

  // validateForm!: UntypedFormGroup;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  submitData(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // updateConfirmValidator(): void {
  //   /** wait for refresh value */
  //   Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  // }

  // confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
  //   if (!control.value) {
  //     return { required: true };
  //   } else if (control.value !== this.validateForm.controls.password.value) {
  //     return { confirm: true, error: true };
  //   }
  //   return {};
  // };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  // constructor(private fb: UntypedFormBuilder) {}

  // ngOnInit(): void {
  //   this.validateForm = this.fb.group({
  //     email: [null, [Validators.email, Validators.required]],
  //     password: [null, [Validators.required]],
  //     checkPassword: [null, [Validators.required, this.confirmationValidator]],
  //     nickname: [null, [Validators.required]],
  //     phoneNumberPrefix: ['+86'],
  //     phoneNumber: [null, [Validators.required]],
  //     website: [null, [Validators.required]],
  //     captcha: [null, [Validators.required]],
  //     agree: [false]
  //   });
  // }
}