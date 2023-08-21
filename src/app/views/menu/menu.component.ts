import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  tabList: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.tabList.push(
      {
        name: "Home",
        content: [{
          
        }]
      },
      {
        name: "Our Menu",
        content: "Menu test content"
      },
      {
        name: "About",
        content: "About test content"
      },
      {
        name: "Contact Us",
        content: "Contact Us test content"
      },
      {
        name: "Location",
        content: "Location test content"
      }
    );
  }
}
