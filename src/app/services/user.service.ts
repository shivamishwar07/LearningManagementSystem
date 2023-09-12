import { EventEmitter, Injectable } from '@angular/core';
import { Login, faculty, student } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
const studentList = 'http://localhost:3000/studentData'
const facultyList='http://localhost:3000/facultyData'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  isLoginError = new EventEmitter<boolean>(false)
  modalService: any;
  loginError:string="";
  isUserLoggedIn=new BehaviorSubject<boolean>(false)
  constructor(private http: HttpClient, private router: Router) { }

  userLogin(data: Login) {
    this.http.get<student[]>(`http://localhost:3000/loginInfo?email=${data.email}&password=${data.password}`,
      { observe: 'response' }).subscribe((result: any) => {
        if (result && result.body && result.body.length) {
          localStorage.setItem('user', JSON.stringify(result.body[0]));
          this.router.navigate(['/admin'])
          this.isUserLoggedIn.next(true);
        }
        else {
          this.isLoginError.emit(true)
        }
      })
  }
  userSubmit(user: student) {
    this.http.post("http://localhost:3000/studentData", user, { observe: 'response' }).subscribe((result) => {
      if (result) {
        this.showModal();
      }
    })
  }
  reload()
  {
    if(localStorage.getItem('user'))
    {
      this.isUserLoggedIn.next(true);
      this.router.navigate(['/admin'])
    }
  }
  saveData(email: string, password: string) {
    const formData = {
      email: email,
      password: password,
    };
    return this.http.post('http://localhost:3000/loginInfo', formData, { observe: 'response' }).subscribe((result) => {
      if (result) {
      }
    });
  }

  getUser(id: string) {
    return this.http.get<student>(`http://localhost:3000/studentData/${id}`)
  }

  updateUser(student: student) {
    return this.http.put<student>(`http://localhost:3000/studentData/${student.id}`, student)
  }
  updateFaculty(faculty:faculty) {
    return this.http.put<faculty>(`http://localhost:3000/facultyData/${faculty.id}`, faculty)
  }
  
  studentList() {
    return this.http.get<student[]>('http://localhost:3000/studentData');
  }

  userAuthReload() {
    if (localStorage.getItem('user'))
      this.router.navigate(['AdminComponent'])
  }
  isVisible = false;
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  showConfirm(): void {
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Bla bla ...',
      nzOkText: 'OK',
      nzCancelText: 'Cancel'
    });
    this.router.navigate(['/student'])
  }
  deleteStudent(id: number) {
    return this.http.delete(`http://localhost:3000/studentData/${id}`)
  }

  getAllPost(): Observable<any> {
    return this.http.get(studentList);
  }
  getAllFaculty(): Observable<any> {
    return this.http.get(facultyList);
  }
}
