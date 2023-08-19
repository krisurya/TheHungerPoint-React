import { Component, OnInit, isDevMode } from '@angular/core';
import { AuthenticationService } from '../../services';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {
  isAuth: boolean;

  constructor(public auth : AuthenticationService) { }

  ngOnInit(): void {
    if (isDevMode()) {
      console.log('Development!');
    } else {
      console.log('Production!');
    }
    this.checkAuth();
    var element = document.body;
    element.classList.remove("angularPos");
  }

  logOut(){
    this.auth.signOut();
  }
  async checkAuth(){
    const status = await this.auth.checkIfUserIsConnected();
    console.log(status);
    status ? this.isAuth = true : this.isAuth = false;
  }

  refreshPage(){
    window.location.reload();
  }
}
