import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showHeader = true;

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
        this.showHeader = !this.shouldHideHeader(event.urlAfterRedirects);
      }
    });
  }

  // Hàm kiểm tra nếu header cần ẩn
  private shouldHideHeader(url: string): boolean {
    // Kiểm tra nếu URL bắt đầu với bất kỳ route nào trong hiddenRoutes
    return this.hiddenRoutes.some(route => url.startsWith(route));
  }
}
