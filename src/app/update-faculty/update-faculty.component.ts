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
  selector: 'app-update-faculty',
  templateUrl: './update-faculty.component.html',
  styleUrls: ['./update-faculty.component.css']
})
export class UpdateFacultyComponent {
  facultyData: faculty | undefined;
  studentData: undefined | student
  modalService: any;
  studentList!: student[];
  showStudentForm: boolean = true;
  showFacultyForm: boolean = false;
  showTable: boolean = true;
  totalStudent: number = 0;
  deletedMessage: undefined | string = "Student Removed Sucessfully";
  updateForm: boolean = false;
  menuType: string = "student";
  showForm: boolean = false;
  validateForm!: UntypedFormGroup;
  password: string = '';
  hidePassword: boolean = true;
  hideCPassword: boolean = true
  isSucessfull = false;
  isError = false;
  confirmModal?: NzModalRef; 
  constructor(
    private fb: UntypedFormBuilder,
    private route: Router,
    private http: HttpClient,
    private user: UserService,
    private faculty: FacultyService,
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
      department: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      phoneNumber: [null, [Validators.required]],
      age: [null, [Validators.required]],
      course: [null, [Validators.required]],
    });
    let facultyId = this.router.snapshot.paramMap.get('id')
    facultyId && this.faculty.getUser(facultyId).subscribe((result) => {
      if (result) {
        this.facultyData = result;
      }
    })
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.validateForm.value.id = this.facultyData?.id
      this.user.updateFaculty(this.validateForm.value).subscribe((result) => {
        if (result) {
          this.showModal()
        }
        else {
          console.log("Not getting data");
        }
      });
      setTimeout(() => {
        this.isSucessfull = false;
        this.route.navigate(['/faculty'])
      }, 3000)
    }
    else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

    }
  }


  
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

  
  showModal(): void {
    this.isSucessfull = true;
  }
  handleOk(): void {
    this.isSucessfull = false;
    this.route.navigate(['/faculty'])
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
  cancelForm() {
    this.route.navigate(['/faculty'])
  }
}
