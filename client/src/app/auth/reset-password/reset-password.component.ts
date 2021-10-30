import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  user
  constructor(private authService: AuthService, public toastr: ToastrService, public router: Router) {
    this.user = {}
  }

  ngOnInit() {
  }

  resetPassword() {
    this.authService.resetPass(this.user).subscribe((response: any) => {
      this.router.navigate(['/auth/login']);
      this.toastr.success('Your password has been reset successfully !')
      localStorage.clear();

    })

  }

}
