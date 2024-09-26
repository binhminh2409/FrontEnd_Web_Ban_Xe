import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginF: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private loginSrv: LoginService) { }

  onLogin(): void {
    if (this.loginF.invalid) { return; }
  
    this.loginSrv.login(this.loginF.value).subscribe(
      (res: any) => {
        console.log(res);
        console.log("Login Successfully");
        localStorage.setItem('token', res);
        location.assign('http://localhost:4200');
      },
      (error: any) => {
        console.error(error);
        if (error.error && error.error.message) {
          alert(error.error.message);
        } else {
          alert("Wrong Email or password.");
        }
        console.log("Login failed");
        localStorage.removeItem('token');
      }
    );
  }
  
}
