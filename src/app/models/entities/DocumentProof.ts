export class DocumentProof {
  id?: number;
  userId: number;
  fileName: string;
  fileExtension: string;
  mimeType: string;
  uploadDate: Date;
  documentType: string;
  insuranceType: string;
}

export enum DocumentType {
  Passport = 'Passport',
  DriverLicense = 'DriverLicense',
  AadharCard = 'AadharCard',
  // Add other document types as needed
}
