import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gray-800 text-white py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">SyndicNow</h3>
            <p class="text-gray-300">Making property management easier.</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a href="/about" class="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="/contact" class="text-gray-300 hover:text-white">Contact</a></li>
              <li><a href="/privacy" class="text-gray-300 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
            <p class="text-gray-300">Email: contact&#64;syndicnow.com</p>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center">
          <p class="text-gray-300">&copy; 2025 SyndicNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
