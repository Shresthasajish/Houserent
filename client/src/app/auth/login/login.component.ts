import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user;
  loggedInUser;
  constructor(public authService: AuthService, private toastr: ToastrService, public router: Router) {
    this.user = new User({})
    this.loggedInUser = {}

  }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.user)
      .subscribe((data: any) => {
        console.log("Data of logged in user--->", data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        this.loggedInUser = data

        let isLoggedIn = true;

        this.toastr.success('You are Logged In')
        this.router.navigate(['/'])

      }, (err) => {
        this.toastr.info('Username or password doesnot match')
        console.log(err)

      })


  }

}
