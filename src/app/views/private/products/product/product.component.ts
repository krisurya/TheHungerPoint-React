import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Validators } from '@angular/forms';
import { FieldConfig, FormConfig } from 'ngx-nomad-form';
import { Observable } from 'rxjs';
import { Category } from 'src/app/core/models';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() product: any;
  @Input() display: boolean = false;
  @Output() call = new EventEmitter<any>();

  categories: any[] = [];


  isAddForm: boolean = false;

  //My fields
  fields: FieldConfig[] = [];

  formConfig: FormConfig = {
    name: 'productForm',
    enctype: 'text/plain',
  };
  uploadedImageUrl: Observable<string>;

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {}

  ngOnInit(){
    this.afs.collection('categories').valueChanges().subscribe((res : any) => {
      this.categories = [];
      res.forEach((element) => {
       this.categories.push({
         'label': element.name,
         'value': element.id
        });
      });
    });

    this.isAddForm = this.product?.name ? false : true;

    this.uploadedImageUrl = this.product.imageURL;

    this.fields = [
      {
        type: 'input',
        label: 'Name',
        inputType: 'text',
        name: 'name',
        col: 12,
        value: this.product?.name ? this.product?.name : 'Onion Pizza',
        validations: [{
          name: 'required',
          validator: Validators.required,
          message: 'Name is required'
        }]
      },{
        type: 'input',
        label: 'Price',
        inputType: 'number',
        name: 'price',
        value: this.product?.price ? this.product?.price : 190,
        col: 12,
        validations: [{
          name: 'required',
          validator: Validators.required,
          message: 'price is required'
        }]
      },{
        type: 'input',
        label: 'Stock',
        inputType: 'number',
        name: 'stock',
        value: this.product?.stock ? this.product?.stock : 100,
        col: 12,
        validations: [{
          name: 'required',
          validator: Validators.required,
          message: 'stock is required'
        }]
      },{
        type: 'select',
        label: 'Category',
        name: 'category',
        value: this.product?.category,
        col: 12,
        options: []
      },{
        type: 'button',
        color: 'primary',
        label: this.product.name ? 'Update' : 'Save',
        col: 12
      }
    ];
    setTimeout(() => {
      this.fields[3].options = this.categories;
      this.fields[3].value = "Pizza";
    }, 500);
  }

  callBack(formData: any){
    formData["imageURL"] = this.uploadedImageUrl;
    this.call.emit({
      'id' : this.product?.id,
      'isAddForm' : this.isAddForm,
      ...formData
    });
  }

  async upload(event) {
    var file = event.target.files[0];
    const fileRef = this.storage.ref("TheHungerPointAssets").child(file.name);

    if (!!file) {
      const result = await fileRef.put(file);
      const currentImageUrl = await this.storage
            .ref(result.ref.fullPath)
            .getDownloadURL()
            .toPromise();
      this.uploadedImageUrl = currentImageUrl;
    }
  }
}
