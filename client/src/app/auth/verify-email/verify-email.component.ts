import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  verify;
  constructor(public authService: AuthService, private toastr: ToastrService, public router: Router) {
    this.verify = {}
  }

  ngOnInit() {


  }

  verifyFunc() {
    console.log('This verify-->', this.verify)
    this.authService.verify(this.verify)
      .subscribe((data) => {
        console.log(data)
        this.toastr.success('Email Verified successfull')
        this.router.navigate(['/auth/login'])
      }, (err) => {
        console.log(err)

      })

  }

}
