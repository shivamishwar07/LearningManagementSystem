import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { student } from '../data-type';
import { NzModalRef } from 'ng-zorro-antd/modal';
interface DataItem {
  name: string;
  age: number;
  address: string;
}
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  modalService: any;
  studentList!:student[];
  showTable: boolean = true;
  totalStudent:number=0;
  deletedMessage:undefined| string="Student Removed Sucessfully";
  updateForm: boolean=false;
  constructor(private fb: UntypedFormBuilder, private route: Router, private http: HttpClient, private user: UserService, modalService: NzModalService ,private modal: NzModalService,
    private router:ActivatedRoute,
    ) {
    this.list();
  }

  ngOnInit(): void {
    this.getPage();
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      fName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      phoneNumber: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      userCourse: [null, [Validators.required]],
      userSub: [null, [Validators.required]],
    });
    let studentId=this.router.snapshot.paramMap.get('id')
    
  }
  password: string = '';
  hidePassword: boolean = true;
  hideCPassword:boolean=true
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  toggleCPasswordVisibility() {
    this.hideCPassword = !this.hideCPassword;
  }
  menuType: string = "student";
  showForm: boolean = false;

  validateForm!: UntypedFormGroup;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };
  submitForm(): void {
    if (this.validateForm.valid) {
      this.user.userSubmit(this.validateForm.value);
      this.user.saveData(this.validateForm.value.email,this.validateForm.value.password);
      this.showModal()
      this.resetForm();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.showError();
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
  displayForm() {
    this.showForm = true;
    this.showTable = false
  }
  cancelForm() {
    this.showForm = false;
    this.showTable=true;
  }
  resetForm() {
    this.validateForm.reset();
  }

  isSucessfull = false;
  showModal(): void {
    this.isSucessfull = true;
  }
  handleOk(): void {
    this.isSucessfull = false;
    this.showForm = false;
    this.showTable=true;
    this.list()
  }
  handleCancel(): void {
    this.isSucessfull = false;
  }
showConfirm(): void {
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Bla bla ...',
      nzOkText: 'OK',
      nzCancelText: 'Cancel'
    });
    this.showForm = false;
  }
  



  isError = false;
  showError(): void {
    this.isError = true;
  }
  handleOkError(): void {
    this.isError = false;
    this.showForm = false;
    this.showTable=true;
    this.list()
  }
  handleCancelError(): void {
    this.isError = false;
    
  }
  showConfirmError(): void {
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Bla bla ...',
      nzOkText: 'OK',
      nzCancelText: 'Cancel'
    });
    this.showForm = false;
  }
 
  list() {
    this.user.studentList().subscribe((result) => {
      this.studentList = result;
      this.totalStudent=this.studentList.length;
    })
  }
  toggleShow () {
    var el = document.getElementById("box");
    el!.classList.toggle("show");
  }

  deleteStudent(id:number){
    this.user.deleteStudent(id).subscribe((result)=>{
      if(result)
      {
        this.deletedMessage="Product Removed"
        this.list();
      }
    })
    setTimeout(() => {
      this.deletedMessage=undefined;
    }, 1000);
}
confirmModal?: NzModalRef; // For testing by now

showConfirmm(id:number): void {
  this.confirmModal = this.modal.confirm({
    nzTitle: 'Are you sure?',
    nzContent: 'To remove this user from LMS',
    nzOnOk: () =>
    new Promise((resolve, reject) => {
      setTimeout(Math.random() > 0.5 ? resolve : reject, 50);
      resolve: this.deleteStudent(id);
    }).catch(() => console.log('Oops errors!'))
  });
}


updateStudent(val:number){
  this.updateForm=true;
  this.showTable=false;
}
updateCancelForm(){
  this.isSucessfull = false;
  this.updateForm=false;
  this.showTable=true;
}
posts:any;
page:number=1;
tableSize:number=5;
getPage(){
  this.user.getAllPost().subscribe((result)=>{
    if(result)
    this.posts=result;
  else
  console.log("No Data Fount......");
  })
}
}
