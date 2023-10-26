import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/entities/brand';
import { BrandService } from 'src/app/services/brand.service';
import { ErrorService } from 'src/app/services/error.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-brand-update',
  templateUrl: './admin-brand-update.component.html',
  styleUrls: ['./admin-brand-update.component.css']
})
export class BrandUpdateComponent implements OnInit {
  currentBrand: Brand;
  brandUpdateForm: FormGroup

  constructor(
    private brandService: BrandService,
    private toastrService: ToastrService,
    private updateModal: MatDialogRef<BrandUpdateComponent>,
    private errorService: ErrorService,
    private formService: FormService
  ) { }

  ngOnInit(): void {
    this.createBrandUpdateForm();
  }

  update() {
    if (this.brandUpdateForm.valid) {
      let newBrand = Object.assign({}, this.brandUpdateForm.value);
      newBrand.id = this.currentBrand.id;

      if (newBrand.name == this.currentBrand.name) {
        this.toastrService.error("Brand name is same as before", "Failed to Update");
        return;
      }

      this.brandService.update(newBrand).subscribe(() => {
        this.toastrService.success(this.currentBrand.name + ", " + newBrand.name + " Updated", "Updated Successfully");
        this.closeUpdateModal();
      }, errorResponse => {
        this.errorService.showBackendError(errorResponse, "Brand Update Failed");
      })

    } else {
      this.toastrService.error("Brand name must be between 2-50 characters", "Form Invalid");
      this.brandUpdateForm.reset();
    }
  }

  closeUpdateModal() {
    this.updateModal.close();
  }

  createBrandUpdateForm() {
    this.brandUpdateForm = this.formService.createBrandForm();
  }
}
