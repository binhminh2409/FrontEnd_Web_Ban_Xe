import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showHeader = true;
  showFooter = true;

  // Khai báo hiddenRoutes
  private hiddenRoutes: string[] = [
    '/admin-login',
    '/register',
    '/admin-panel',
    '/employee'
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Kiểm tra nếu route hiện tại có trong hiddenRoutes hoặc là route con
        const shouldHide = this.shouldHideHeader(event.urlAfterRedirects);
        this.showHeader = !shouldHide;
        this.showFooter = !shouldHide;
      }
    });
  }

  // Hàm kiểm tra nếu header/footer cần ẩn
  private shouldHideHeader(url: string): boolean {
    return this.hiddenRoutes.some(route => url.startsWith(route));
  }
}
