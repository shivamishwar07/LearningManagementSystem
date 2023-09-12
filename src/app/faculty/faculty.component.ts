import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { faculty, student } from '../data-type';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FacultyService } from '../services/faculty.service';
@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent {
  modalService: any;
  facultyList!:faculty[];
  showTable: boolean = true;
  totalFaculty:number=0;
  deletedMessage:undefined| string="Student Removed Sucessfully";
  updateForm: boolean=false;
  constructor(private fb: UntypedFormBuilder, private route: Router, private http: HttpClient, private faculty:FacultyService, modalService: NzModalService ,private modal: NzModalService,
    private router:ActivatedRoute,
    ) {
  }

  ngOnInit(): void {
    this.getPage();
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      department: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      phoneNumber: [null, [Validators.required]],
      age: [null, [Validators.required]],
      course: [null, [Validators.required]],
    });
    this.list();
    
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
      this.faculty.userSubmit(this.validateForm.value)
      this.faculty.saveData(this.validateForm.value.email,this.validateForm.value.password);
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
    this.faculty.getAllFaculty().subscribe((result) => {
      this.facultyList = result;
      this.totalFaculty=this.facultyList.length;
    })
  }
  toggleShow () {
    var el = document.getElementById("box");
    el!.classList.toggle("show");
  }

  deleteStudent(id:number){
    this.faculty.deleteStudent(id).subscribe((result)=>{
      if(result)
      {
        this.deletedMessage="Product Removed"
        // this.list();
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
  this.faculty.getAllFaculty().subscribe((result)=>{
    if(result)
    this.posts=result;
  else
  console.log("No Data Fount......");
  })
}
}
