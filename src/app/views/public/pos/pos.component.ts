import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { FirebaseService, NotifyService } from 'src/app/core/services';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {

  tables: any = [];
  products : any;
  content: any = null;
  basket: any = [];
  backup : any = [];
  cartTotal: number;
  cartNumItems: number;
  addQRCode: boolean = false;
  manualItemToCart: boolean = false;
  manualItem: any = {
    id: 0,
    name: '',
    price: '',
    quantity: ''
  };


  categories: any;
  imageUrl: any;
  newOrderID:number = 0;
  currentTableNumber: number = 0;

  constructor(
    private firestore : FirebaseService,
    private notify : NotifyService,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.manualItem.quantity = 1;
    this.products = [{
      id: 1,
      category: 'test',
      icon : 'test',
      content : [{
        id: 1,
        name : 'test',
        image : 'test.jpeg',
        quantity : 1,
        price : 1,
        available : true,
        stock : 1,
      }],
    },{
      id: 2,
      category: 'Drink',
      icon : 'nav-home-tab',
    }]
    this.content = this.products[0].content;

    this.firestore.getDocuments("category")
      .then((data) => {
        if (data.length === 0) {
          console.log(data);
        }
        else {
          console.log(data);
        }
      })
      .catch(err => {
        this.notify.error2("Oup's une erreur est survenu :(");
      });

      this.fetch();

      this.getNewOrderID();
      this.getAllTablesOrders();
      this.currentTableNumber = 1;
      this.getOrderByTable(this.currentTableNumber);
  }

  fetch(){
    this.afs.collection('categories').valueChanges().subscribe((res : any) => {
      this.categories = res;
      console.log(this.categories);
        this.categories.forEach(async (element, key) => {
          this.categories[key].products = await this.findProducts(element.id);
        });
    });
  }

  async findProducts(category){
    return new Promise(resolve => {
      this.afs.collection('products', ref => ref.where('category', '==', category)).valueChanges().subscribe((res : any) => {
        resolve(res);
      });
    });
  }

  show(item){
    this.content = item.content;
  }

  updateDiscount(a) {
    if(a.discount > 100){
      alert("Discount should be less than 100 %");
      return;
    }
    a = { quantity: 1, ...a }
    var isPresent = this.basket.some(function (el) { return el.name === a.name });
    if(isPresent == true){
      const _discount = a.discount;
      const _discountedPrice = ((a.price * (100 - a.discount))/100) * a.quantity;
      this.basket.find(item => item.id == a.id).discount = _discount;
      this.basket.find(item => item.id == a.id).discountPrice = _discountedPrice;
      this.backup.find(item => item.id == a.id).discount = _discount;
      this.backup.find(item => item.id == a.id).discountPrice = _discountedPrice;
    }

    this.calculateTotal();
  }

  addItemToCart(a){
    a = { quantity: 1, ...a }
    a.discount = 0;
    a.discountPrice = a.price;
    if(this.basket == '' || this.basket == null){
      this.backup.push(a);
      this.basket.push(a);
    } else {
      var isPresent = this.basket.some(function (el) { return el.name === a.name });
      console.log(isPresent);
      if(isPresent == false){
        this.backup.push(a);
        this.basket.push(a);
      }
    }
    this.calculateTotal();
  }

  /*add(x){
    x.quantity = x.quantity + 1;
    var isp = this.backup.some(function (el) {
      if (el.name === x.name ){
        var p = el.price;
        x.price = p * x.quantity;
        return x.price;
      }
    });

    console.log(isp);

  }*/

  add(x) {
    // If the item already exists, add 1 to quantity
    if (this.basket.includes(x)) {
      this.basket[this.basket.indexOf(x)].quantity += 1;
    } else {
      this.basket.push(x);
    }
    this.calculateTotal();
  }

  reduce(x) {
    // Check if last item, if so, use remove method
    if (this.basket[this.basket.indexOf(x)].quantity === 1) {
      this.remove(x);
    } else {
      this.basket[this.basket.indexOf(x)].quantity = this.basket[this.basket.indexOf(x)].quantity - 1;
    }
    this.calculateTotal();
  }

  remove(x) {
    // Check if item is in array
    if (this.basket.includes(x)) {
      // Splice the element out of the array
      const index = this.basket.indexOf(x);
      if (index > -1) {
        // Set item quantity back to 1 (thus when readded, quantity isn't 0)
        this.basket[this.basket.indexOf(x)].quantity = 1;
        this.basket.splice(index, 1);
      }
    }
    this.calculateTotal();
  }

  calculateTotal() {
    let total = 0;
    let cartitems = 0;
    // Multiply item price by item quantity, add to total
    this.basket.forEach(function (x) {
      total += (x.discountPrice * x.quantity);
      cartitems += x.quantity;
    });
    this.cartTotal = total;
    this.cartNumItems = cartitems;
  }

  // Remove all items from cart
  clearCart() {
    // Reduce back to initial quantity (1 vs 0 for re-add)
    this.basket.forEach(function (x) {
      x.quantity = 1;
    });
    // Empty local ticket variable then sync
    this.basket = [];
    this.calculateTotal();
  }

  checkout() {
      let isValid = true;
      if (this.basket.length > 0) {

        // check if discount is more than 100% stop billing
        this.basket.forEach(function (x) {
          if(x.discount > 100)
          {
            alert("discount is more than 100 % for item" + x.name);
            isValid = false;
          }
        });
        if(isValid){
        //Pay
        console.log(this.basket);
        this.saveOrder(this.basket);
        this.print();
      } else {
        Swal.fire("Empty", "", "error");
      }
    }
  }

  async saveOrder(basket: any){
    console.log('add');
    const currentTable = this.tables.find(x => x.Id == this.currentTableNumber);
    // const orderID = await this.generateNewOrderID();
      if(this.newOrderID > 0){
        let data = {
          id: this.afs.createId(),
          orderId: this.newOrderID,
          carts: JSON.stringify(basket),
          amount: this.cartTotal,
          status: true,
          created_at: moment().format(),
          updated_at: moment().format(),
          tableNumber: this.currentTableNumber,
          customerName: currentTable.CustomerName,
          customerPhone: currentTable.CustomerPhone
        };
    
        this.afs.collection('sales').doc("Order_" + data.orderId).set(data).then(() => {
          Swal.fire("OK", "", "success").then(()=> {
            this.resetTable(this.currentTableNumber);
            this.backup = [];
            this.basket = [];
          });
        }, err => {
          this.notify.error2("new order is not placed, some error occured" + err);
        });
      }
      else{
        this.notify.error2("new orderID is not generated properly!");
      }
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Bill Print</title>
        </head>
        <body onload="window.print();">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  addItemsToCartManually(): void {
    if(this.manualItem.quantity && parseInt(this.manualItem.quantity) && this.manualItem.name && this.manualItem.price && parseInt(this.manualItem.price)) {
      this.manualItem.id = this.afs.createId();
      this.addItemToCart(this.manualItem);
    }
  }

  toggleManualItemToCart(): void {
    this.manualItemToCart = !this.manualItemToCart;
  }

  async generateNewOrderID(): Promise<number> {
    return new Promise(() => {
    });
  }

  onTableChange(table, isForce: boolean = false) {
    const currentTableCached = this.tables.find((x) => x.Id == this.currentTableNumber);
    if(this.currentTableNumber != table.Id || isForce) {
      let data = {
        Id: this.currentTableNumber,
        Basket: this.basket,
        Backup : this.backup,
        CartTotal: this.cartTotal,
        CartNumItems: this.cartNumItems,
        CustomerName: currentTableCached.CustomerName ? currentTableCached?.CustomerName : '',
        CustomerPhone: currentTableCached.CustomerPhone ? currentTableCached?.CustomerPhone : ''
      };
      this.afs.collection("tables").doc("table"+this.currentTableNumber).set(data).then(() => {
        this.currentTableNumber = table.Id;
        this.getOrderByTable(table.Id);
        console.log("Table Changed Successfully!");
      }, err => {
        this.notify.error2("problem in changing table" + err);
      });
    }
  }

  addNewTable() {
    let newTableID = 1;
    const tableIds = this.tables.map(table => {
      return table.Id;
    });

    if (tableIds.length > 0) {
      newTableID = Math.max(...tableIds) + 1;
    }

    const data = {
      Id: newTableID,
      CustomerName: '',
      CustomerPhone: ''
    };

    this.afs.collection("tables").doc("table"+newTableID).set(data).then(() => {
      Swal.fire("Table Added Successfully!", "", "success");
    }, err => {
      this.notify.error2("new table is not added, some error occured" + err);
    });
  }

  private async getOrderByTable(tableId: number) {
    let data: any = await this.getOrderByTableAsync(tableId);
    this.basket = data["Basket"] != undefined ? data["Basket"] : [];
    this.backup = data["Backup"] != undefined ? data["Backup"] : [];
    this.cartTotal = data["CartTotal"] != undefined ? data["CartTotal"] : [];
    this.cartNumItems = data["CartNumItems"] != undefined ? data["CartNumItems"] : [];
  }

  private getNewOrderID() {
    this.afs.collection('sales').valueChanges().subscribe((orders: any) => {
      const ids = orders.map(object => {
        return object.orderId;
      });

      if (ids.length > 0) {
        this.newOrderID = Math.max(...ids) + 1;
      }
      else {
        this.newOrderID = 100001;
      }
    }, (error) => {
      this.notify.error2("new orderID is not generated properly: unable to get existing orderIDs" + error);
      return 0;
    });
  }

  private getAllTablesOrders() {
    this.afs.collection('tables').valueChanges().subscribe((tables: any) => {
        this.tables = tables.sort((a, b) => {
          return a.Id - b.Id;
        });
    }, (error) => {
      this.notify.error2("new orderID is not generated properly: unable to get existing orderIDs" + error);
      return 0;
    });
  }

  async getOrderByTableAsync(tableId: number){
    return new Promise((resolve, reject) => {
      this.afs.collection<any>('tables').doc("table" + tableId).ref.get().then((doc) => {
        if (doc.exists) {
            resolve(doc.data());
        } else {
            return 'Doc does not exits';
        }
    })
    .catch((err) => {
        console.error(err);
    });
    });
  }

  resetTable(tableId) {
    this.afs.collection("tables").doc("table"+tableId).set({Id: tableId, Basket: [], Backup: [], CartTotal: 0, CartnumItems: 0, CustomerName: '', CustomerPhone: ''}).then(() => {
      console.log("Table reset successfully!");
    }, err => {
      this.notify.error2("problem in resetting table" + err);
    });
  }

  updateCustomerDetails(table) {
    let data = this.tables.find((x) => x.Id == table.Id);
    data.CustomerName = table.CustomerName;
    data.CustomerPhone = table.CustomerPhone;
    this.onTableChange(table, true);
  }
}
