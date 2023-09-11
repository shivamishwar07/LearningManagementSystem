import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { faculty, student } from '../data-type';
import { FacultyService } from '../services/faculty.service';
@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent {

  facultyData: faculty |undefined;
  studentData: undefined | student
  modalService: any;
  studentList!: student[];
  showStudentForm:boolean=true;
  showFacultyForm:boolean=false;
  showTable: boolean = true;
  totalStudent: number = 0;
  deletedMessage: undefined | string = "Student Removed Sucessfully";
  updateForm: boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    private route: Router,
    private http: HttpClient,
    private user: UserService,
    private faculty:FacultyService,
    modalService: NzModalService,
    private modal: NzModalService,
    private router: ActivatedRoute,
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
      department: [null, [Validators.required]],
      age: [null, [Validators.required]],
      course: [null, [Validators.required]],
    });
    // this.validateForm = this.fb.group({
    //   userName: [null, [Validators.required]],
    //   email: [null, [Validators.email, Validators.required]],
    //   department: [null, [Validators.required]],
    //   password: [null, [Validators.required]],
    //   checkPassword: [null, [Validators.required, this.confirmationValidator]],
    //   phoneNumber: [null, [Validators.required]],
    //   age: [null, [Validators.required]],
    //   course: [null, [Validators.required]],
    // });
    let studentId = this.router.snapshot.paramMap.get('id')
    studentId && this.user.getUser(studentId).subscribe((result) => {
      if (result) {
        this.studentData = result;
      }
    })
    let facultyId = this.router.snapshot.paramMap.get('id')
    facultyId && this.faculty.getUser(facultyId).subscribe((result) => {
      if (result) {
        this.facultyData = result;
      }

    })

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
      this.validateForm.value.id=this.studentData?.id
      this.user.updateUser(this.validateForm.value).subscribe((result)=>{
        if(result)
        {
          this.showModal()
        }
        else
        {
          console.log("Not getting data");
        }
      });
      setTimeout(()=>{
        this.isSucessfull=false;
        this.route.navigate(['/student'])
      },1000)
      // this.user.saveData(this.validateForm.value.email, this.validateForm.value.password);
      this.resetForm();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      
    }
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
  resetForm() {
    this.validateForm.reset();
  }

  isSucessfull = false;
  showModal(): void {
    this.isSucessfull = true;
  }
  handleOk(): void {
    this.isSucessfull = false;
    this.route.navigate(['/student'])
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
    this.showTable = true;
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
      this.totalStudent = this.studentList.length;
    })
  }
  toggleShow() {
    var el = document.getElementById("box");
    el!.classList.toggle("show");
  }

  deleteStudent(id: number) {
    this.user.deleteStudent(id).subscribe((result) => {
      if (result) {
        this.deletedMessage = "Product Removed"
        this.list();
      }
    })
    setTimeout(() => {
      this.deletedMessage = undefined;
    }, 1000);
  }
  confirmModal?: NzModalRef; // For testing by now

  showConfirmm(id: number): void {
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


  updateStudent(val: number) {
  }
  updateCancelForm() {
    this.isSucessfull = false;
    this.updateForm = false;
    this.showTable = true;
  }
  posts: any;
  page: number = 1;
  tableSize: number = 5;
  getPage() {
    this.user.getAllPost().subscribe((result) => {
      if (result)
        this.posts = result;
      else
        console.log("No Data Fount......");
    })
  }
  cancelForm(){
    this.route.navigate(['/faculty'])
  }
}
