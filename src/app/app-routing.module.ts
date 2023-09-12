import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAuthComponent } from './login-auth/login-auth.component';
import { AdminComponent } from './admin/admin.component';
import { StudentComponent } from './student/student.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { FacultyComponent } from './faculty/faculty.component';
import { AuthGuard } from './auth.guard';
import { UpdateFacultyComponent } from './update-faculty/update-faculty.component';
import { AttendenceComponent } from './attendence/attendence.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path:'auth',
    component:LoginAuthComponent
  },
  {
    path:'admin',
    component:AdminComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'student',
    component:StudentComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'updateUser/:id',
    component:UpdateProfileComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'faculty',
    component:FacultyComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'updateFaculty/:id',
    component:UpdateFacultyComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'attendence',
    component:AttendenceComponent,
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
