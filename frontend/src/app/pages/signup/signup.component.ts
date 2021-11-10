import { Component, OnInit } from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSignupButtonClick(email: string, password: string) {
    this.authService.signUp(email, password).subscribe((res: HttpResponse<any>) => {
      console.log(res);
    })
  }
}
