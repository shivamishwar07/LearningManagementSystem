import { Component } from '@angular/core';

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.css']
})
export class AttendenceComponent {
  isToggled = false;
  toggleValue = 0;

  toggle() {
    this.isToggled = !this.isToggled;
    this.toggleValue = this.isToggled ? 1 : 0;
  }
}
