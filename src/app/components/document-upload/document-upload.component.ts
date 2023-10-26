import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/entities/brand';
import { Color } from 'src/app/models/entities/color';
import { UploadFile } from 'src/app/models/uploadFile';
import { BrandService } from 'src/app/services/brand.service';
import {
  DocumentUploadService,
  DocumentUploadService as documentImageService,
} from 'src/app/services/document-upload.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';
import { ErrorService } from 'src/app/services/error.service';
import { FormService } from 'src/app/services/form.service';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/entities/user';
import { UserForLogin } from 'src/app/models/auth/userForLogin';

import {
  DocumentProof,
  DocumentType,
} from 'src/app/models/entities/DocumentProof';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit {
  carAddForm: FormGroup;
  brands: Brand[];
  colors: Color[];
  years: number[] = [];

  documentImageFiles: UploadFile[] = [];
  documentImagePaths: any[] = [];

  file: File;
  name: string = '';
  currentUser: any;

  selectedDocumentType: DocumentType;

  documentTypes = Object.values(DocumentType);

  constructor(
    private documentUploadService: DocumentUploadService,
    private authService: AuthService,
    private http: HttpClient,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
  }

  getName(name: string) {
    this.name = name;
  }

  getFile(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
  }

  uploadFile(file: any) {
    console.log(this.currentUser);
    // Create a new DocumentProof object
    const documentProof: DocumentProof = {
      userId: this.currentUser.id,
      uploadDate: new Date(),
      documentType: this.selectedDocumentType,
      fileName: this.name,
      fileExtension: 'document',
      mimeType: 'application/pdf',
      insuranceType: 'full',
    };

    console.log(documentProof)


    this.documentUploadService
      .add(documentProof, file, documentProof.userId)
      .subscribe(
        (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            // Handle upload progress
            const percentDone = Math.round(100 * event.loaded);
            console.log(`File is ${percentDone}% uploaded.`);
          } else if (event.type === HttpEventType.Response) {
            // Handle upload complete
            console.log('File upload successful:', event.body);
          }
        },
        (error) => {
          // Handle error
          this.toastrService.success('File upload sucess', 'sucess');
          console.error('File upload error:', error);
        }
      );
  }
}

