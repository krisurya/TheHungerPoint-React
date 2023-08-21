import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'reciept',
  templateUrl: './reciept.component.html',
  styleUrls: ['./reciept.component.scss']
})
export class RecieptComponent implements OnInit {

  @Input() basket: any[];
  @Input() cartTotal: any;
  @Input() newOrderID: any;
  @Input() addQRCode: boolean;

  totalAmount: string;
  constructor() { }

  ngOnInit(): void {
        
  }
}
