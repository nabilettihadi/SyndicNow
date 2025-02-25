import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar></app-navbar>
      
      <main class="flex-grow">
        <div class="max-w-7xl mx-auto px-4 py-12">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to SyndicNow</h1>
            <p class="text-xl text-gray-600 mb-8">Your modern solution for property management</p>
            <div class="space-x-4">
              <a routerLink="/auth/login" 
                 class="inline-block bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600">
                Get Started
              </a>
              <a href="#features" 
                 class="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300">
                Learn More
              </a>
            </div>
          </div>
          
          <div id="features" class="mt-24">
            <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Our Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="p-6 bg-white rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Easy Management</h3>
                <p class="text-gray-600">Streamline your property management tasks with our intuitive interface.</p>
              </div>
              <div class="p-6 bg-white rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Real-time Updates</h3>
                <p class="text-gray-600">Stay informed with instant notifications and updates.</p>
              </div>
              <div class="p-6 bg-white rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Secure Platform</h3>
                <p class="text-gray-600">Your data is protected with enterprise-grade security.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <app-footer></app-footer>
    </div>
  `
})
export class HomeComponent {}
