import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';




@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  user

  constructor(private authService: AuthService, public toastr: ToastrService, public router: Router) {
    this.user = {}
  }

  ngOnInit() {
  }

  forgotPassword() {
    this.authService.forgotPass(this.user).subscribe((response: any) => {
      this.router.navigate(['/auth/reset-password']);
      this.toastr.success('Your password reset code is sent to your mail!')
      localStorage.clear();

    })

  }

}
