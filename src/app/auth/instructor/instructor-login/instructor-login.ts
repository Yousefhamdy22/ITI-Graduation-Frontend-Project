import {Component} from '@angular/core';
import {AuthService, Role} from '../../auth.service';
import {Router, RouterLink} from '@angular/router';
import {StudentService} from '../../../entities/students/student.service';
import {InstructorService} from '../../../entities/instructors/instructor.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-instructor-login',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './instructor-login.html',
  styleUrl: './instructor-login.scss',
})
export class InstructorLogin {

  name = 'مستخدم';
  role: Role = 'instructor';
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private studentService: StudentService,
    private instructorService: InstructorService
  ) {
  }

  loginAs(role: Role) {
    if (role === 'instructor') {
      this.instructorService.getInstructors().subscribe(list => {
        const pick = list && list.length ? list[0] : null;
        const id = pick ? pick.id : undefined;
        const name = pick ? pick.name : 'مدرس تجريبي';
        this.auth.loginAs('instructor', name, id);
        this.router.navigate(['/instructor']);
      });
      return;
    }
  }

  login() {
    if (this.role === 'instructor') {
      this.instructorService.getInstructors().subscribe(list => {
        const pick = list && list.length ? list[0] : null;
        const id = pick ? pick.id : undefined;
        const name = pick ? pick.name : this.name;
        this.auth.loginAs('instructor', name, id);
        this.router.navigate(['/instructor']);
      });
      return;
    }
  }

}
