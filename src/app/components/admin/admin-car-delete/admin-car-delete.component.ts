import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/models/entities/car';
import { CarImagesService } from 'src/app/services/car-images.service';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-car-delete',
  templateUrl: './admin-car-delete.component.html',
  styleUrls: ['./admin-car-delete.component.css']
})
export class CarDeleteComponent implements OnInit {
  deletedCar: Car;
  constructor(
    private carDeleteModal: MatDialogRef<CarDeleteComponent>,
    private carImagesService: CarImagesService,
    private carService: CarService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
  }

  delete(car: Car) {
    this.carService.delete(car).subscribe(response => {
      this.toastrService.success(car.brandName + " " + car.modelName + " car deleted", "Deletion Succesfull");
      this.closeCarDeleteModal();
    }, errorResponse => {
      this.toastrService.error(errorResponse.error.message, "Deletion Failed");
    })
  }

  getImagePath(imagePath: string) {
    return this.carImagesService.getImagePath(imagePath);
  }

  closeCarDeleteModal() {
    this.carDeleteModal.close();
  }
}
