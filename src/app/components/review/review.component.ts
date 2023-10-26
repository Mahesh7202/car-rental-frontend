import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute for getting query params
import { Review } from 'src/app/models/entities/review';
import { ReviewService } from 'src/app/services/review.service';
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  reviewContent: string = '';
  rating: number = 0;
  displayname: string='';

  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}

  ngOnInit(): void {
  }


  getName(displayname: string){
    this.displayname = displayname;
  }

  rate(selectedRating: number) {
    this.rating = selectedRating;
  }

  submitReview() {
    // Get customer ID and car ID from query params
    const customerId = this.route.snapshot.params['customerid'];
    const carId = this.route.snapshot.params['carid'];

    // Create a Review object with the data
    const review: Review = {
      displayName: this.displayname,
      customerId: customerId,
      carId: carId,
      reviewContent: this.reviewContent,
      rating: this.rating,
      reviewDate: new Date() // You may adjust the date as needed
      };
      console.log(review);

    // Call the ReviewService to add the review
    this.reviewService.addReview(review).subscribe(
      (response) => {
        // Handle success, e.g., show a success message
        console.log('Review added successfully:', response);
        // Optionally, you can navigate to a different page or reset the form
      },
      (error) => {
        // Handle error, e.g., show an error message
        console.error('Error adding review:', error);
      }
    );
  }
}
