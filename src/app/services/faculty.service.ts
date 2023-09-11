import { EventEmitter, Injectable } from '@angular/core';
import { Login, faculty, student } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
const facultyList='http://localhost:3000/facultyData'
@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  userSubmit(user: student) {
    this.http.post("http://localhost:3000/facultyData", user, { observe: 'response' }).subscribe((result:any) => {
      if (result) {
        // this.showModal();
      }
    })
  }
  isLoginError = new EventEmitter<boolean>(false)
  modalService: any;
  constructor(private http: HttpClient, private router: Router) { }

  userLogin(data: Login) {
    this.http.get<student[]>(`http://localhost:3000/loginInfo?email=${data.email}&password=${data.password}`,
      { observe: 'response' }).subscribe((result: any) => {
        if (result && result.body && result.body.length) {
          localStorage.setItem('user', JSON.stringify(result.body[0]));
          this.router.navigate(['/admin'])
        }
        else {
          this.isLoginError.emit(true)
        }
      })
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
    return this.http.get<faculty>(`http://localhost:3000/facultyData/${id}`)
  }

  updateUser(student: student) {
    return this.http.put<student>(`http://localhost:3000/facultyData/${student.id}`, student)
  }
  
  studentList() {
    return this.http.get<student[]>('http://localhost:3000/facultyData');
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
    this.router.navigate(['/faculty'])
  }
  deleteStudent(id: number) {
    return this.http.delete(`http://localhost:3000/facultyData/${id}`)
  }
  getAllFaculty(): Observable<any> {
    return this.http.get(facultyList);
  }
}
