import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  isLogin: any;
  constructor(private loginSrv: LoginService){}
  ngOnInit(): void {
    this.isLogin = this.loginSrv.checkLogin();
    if (this.isLogin && this.isLogin.Name) {
      console.log(this.isLogin.Name);
    } else {
      console.log("Name is not available or user is not logged in.");
    }
    console.log(this.isLogin);
  }

  onLogout(){
    localStorage.clear();
    location.reload();
  }
}
