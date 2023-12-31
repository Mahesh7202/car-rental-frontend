import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'src/app/models/entities/color';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-color-delete',
  templateUrl: './admin-color-delete.component.html',
  styleUrls: ['./admin-color-delete.component.css']
})
export class ColorDeleteComponent implements OnInit {
  deletedColor: Color;
  constructor(
    private deleteColorModal: MatDialogRef<ColorDeleteComponent>,
    private colorService: ColorService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
  }

  delete(color: Color) {
    this.colorService.delete(color).subscribe(response => {
      this.toastrService.success(color.name + " Color Deleted", "Deletion Sucessfull")
      this.closeColorDeleteModal();
    }, errorResponse => {
      this.toastrService.error(errorResponse.error.message, "Failed to Delete Color")
    })
  }

  closeColorDeleteModal() {
    this.deleteColorModal.close();
  }
}
