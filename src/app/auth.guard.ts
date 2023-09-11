import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Login, student} from './data-type';
@Injectable({
  providedIn: 'root'
})
export class UserService {
isUserLoggedIn=new BehaviorSubject<boolean>(false)
  constructor(private http:HttpClient ,private route:Router) { }
  reloadUser(){
    if (localStorage.getItem('user')){
      this.isUserLoggedIn.next(true);
      this.route.navigate(['/admin'])
    }
  }
}