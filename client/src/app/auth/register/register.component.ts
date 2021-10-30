import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user;
  constructor(public authService: AuthService, private toastr: ToastrService, public router: Router) {
    this.user = new User({});
  }

  ngOnInit() {
  }

  register() {
    console.log("this.user-->", this.user)
    this.authService.register(this.user)
      .subscribe((data) => {
        console.log('Registered User---->', data)
        this.toastr.success('Registration successfull')
        this.router.navigate(['/auth/verify'])
      }, (err) => {
        console.log('error from register.component.ts', err)

      })

  }

  goToLogin() {
    this.router.navigate(["/auth/login"])
  }

}
