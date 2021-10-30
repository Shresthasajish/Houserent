import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  name: string
  constructor(private toastr: ToastrService, public router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('token'))
      this.name = JSON.parse(localStorage.getItem('user')).data.name
  }

  isLoggedIn() {
    return localStorage.getItem('token') ? true : false
  }


  logout() {
    localStorage.clear();
    this.toastr.warning('You are Logged Out')

    this.router.navigate(['/']);
  }

}
