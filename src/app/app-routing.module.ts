import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAuthComponent } from './login-auth/login-auth.component';
import { AdminComponent } from './admin/admin.component';
import { StudentComponent } from './student/student.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { FacultyComponent } from './faculty/faculty.component';

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
    component:AdminComponent
  },
  {
    path:'student',
    component:StudentComponent
  },
  {
    path:'updateUser/:id',
    component:UpdateProfileComponent,
  },
  {
    path:'faculty',
    component:FacultyComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
