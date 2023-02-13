import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'aims-pos-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  redirectToSection(sectionId: string) {
    this.router.navigate([], { fragment: sectionId });
  }
}
