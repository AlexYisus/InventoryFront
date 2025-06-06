import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.css',
})

export class AddEditProductComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  productId:number = 0
  name:string = ''
  sku:string = ''
  price:string = ''
  stockQuantity:string = ''
  idCategory:number = 0;
  description:string = ''
  imageFile:File | null = null
  imageUrl:string = ''
  isEditing:boolean = false
  categories:any[] = []
  message:string = ''



  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('productId');
    this.productId = idParam ? Number(idParam) : 0;
  
    this.fetchCategories();
    if (this.productId) {
      this.isEditing = true;
      this.fetchProductById(this.productId);
    }
  }

  //GET ALL CATEGORIES
  fetchCategories():void{
    this.apiService.getAllCategory().subscribe({
      next:(res:any) =>{
        if (res.status === 200) {
          this.categories = res.categories
        }
      },
      error:(error) =>{
        this.showMessage(error?.error?.message || error?.message || "Unable to get all categories" + error)
      }})
  }

  //GET CATEGORY BY ID
  fetchProductById(productId: number):void{
    this.apiService.getProductById(productId).subscribe({
      next:(res:any) =>{
        if (res.status === 200) {
          const product = res.product;
          this.name = product.name;
          this.sku = product.sku;
          this.price = product.price;
          this.stockQuantity = product.stockQuantity;
          this.idCategory = product.idCategory;
          this.description = product.description;
          this.imageUrl = product.imageUrl;
        }else{
          this.showMessage(res.message);
        }
      },
      error:(error) =>{
        this.showMessage(error?.error?.message || error?.message || "Unable to get all categories" + error)
      }})
  }

  handleImageChange(event: Event):void{
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.imageFile = input.files[0]
      const reader = new FileReader();
      reader.onloadend = () =>{
        this.imageUrl = reader.result as string
      }
      reader.readAsDataURL(this.imageFile);
    }
  }

  handleSubmit(event : Event):void {
    event.preventDefault()
    if (this.idCategory === 0) { // O cualquier lógica de validación
      this.showMessage("Debes seleccionar una categoría.");
      return;
    }
    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("sku", this.sku);
    formData.append("price", String(Number(this.price)));
    formData.append("stockQuantity", String(Number(this.stockQuantity)));
    formData.append("idCategory", String(this.idCategory));
    formData.append("description", this.description);

    if (this.imageFile) {
      formData.append("imageFile", this.imageFile);
    }

    if (this.isEditing) {
      formData.append("productId", this.productId!.toString());
      this.apiService.updateProduct(formData).subscribe({
        next:(res:any) =>{
          if (res.status === 200) {
            this.showMessage("product updated successfully")
            this.router.navigate(['/product'])
          }
        },
        error:(error) =>{
          this.showMessage(error?.error?.message || error?.message || "Unable to update a product" + error)
        }})
    }else{
      this.apiService.addProduct(formData).subscribe({
        next:(res:any) =>{
          if (res.status === 200) {
            this.showMessage("Product Saved successfully")
            this.router.navigate(['/product'])
          }
        },
        error:(error) =>{
          this.showMessage(error?.error?.message || error?.message || "Unable to save a product" + error)
        }})

    }
  }

  showMessage(message:string) {
    this.message = message;
    setTimeout(() =>{
      this.message = ''
    }, 4000)
  }
}