import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserForLogin } from 'src/app/models/auth/userForLogin';
import { Observable } from 'rxjs';
import { BrandService } from 'src/app/services/brand.service';
import { Brand } from 'src/app/models/entities/brand';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css'],
})
export class NaviComponent implements OnInit {
  currentUser: UserForLogin;
  brands: Brand[] = [];

  searchQuery: string = '';
  filteredBrands: Brand[] = [];

  isAdmin: boolean;
  isLoggedIn: Observable<boolean>;

  constructor(
    private post: BrandService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.loginStatus;
    this.post.getBrands().subscribe((response) => {
      this.brands = response.data;
      console.log(this.brands);
    });
    this.isLoggedIn.subscribe(() => {
      //if logged in
      this.getCurrentUser();
      this.checkifAdmin();
    });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['']);
    this.toastrService.success(
      'Your Account has been Logged Out,',
      'Logged Out'
    );
  }

  checkifAdmin() {
    if (this.authService.isLoggedIn) {
      this.isAdmin = this.authService.hasRole(this.currentUser, 'admin');
    } else {
      this.isAdmin = undefined!;
    }
  }

  getCurrentUser() {
    this.currentUser = this.authService.getUser()!;
  }

  routeTo() {
    if (this.searchQuery.trim() !== '') {
      this.router.navigate(['/search', this.searchQuery]);
      this.searchQuery = '';
    }
  }

  sendData(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.routeTo();

    } else {
      this.filterBrandsByQuery(this.searchQuery);
    }
  }

  filterBrandsByQuery(query: string): void {
    if(query == ''){
      this.filteredBrands = [];
    }else{
      const lowercasedQuery = query.toLowerCase();
      this.filteredBrands = this.brands.filter((brand) => {
        const lowercasedName = brand.name.toLowerCase();
        return lowercasedName.includes(lowercasedQuery);
      });
    }
  }

  selectSuggestedText(query: string){
    this.searchQuery = query;
  }
}
