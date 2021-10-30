import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwords
  constructor(private authService: AuthService, public toastr: ToastrService, public router: Router) {
    this.passwords = {}
  }

  ngOnInit() {
  }

  changePassword() {
    this.authService.changePass(this.passwords).subscribe((response: any) => {
      this.router.navigate(['/']);
      this.toastr.success('Your password has been changed !')
      localStorage.clear();

    })

  }

  logout() {
    localStorage.clear();
    this.toastr.warning('You are Logged Out')
    this.router.navigate(['/']);
  }

}
