import { Component, inject } from '@angular/core';
import { InvitationsService } from './invitations.service';
import { NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invitations',
  imports: [ FormsModule, NgForOf],
  templateUrl: './invitations.component.html',
  styleUrl: './invitations.component.scss',
})
export class InvitationsComponent {
  private service: InvitationsService = inject(InvitationsService);
  invitations: any[] = [];
  searchText: string;
  filteredList: any[] = [];

  constructor() {
    this.service.getAllInvitations().subscribe((resp) => {
      this.invitations = resp.data;
      this.filteredList = structuredClone(resp.data);
    });
    this.service.invitationsUpdated.subscribe(() => {
      this.service.getAllInvitations().subscribe((resp) => {
        this.invitations = resp.data;
        this.filteredList = structuredClone(resp.data);
      });
    })
  }

  searchByName() {
    this.filteredList = this.invitations.filter((obj) =>
      obj.email.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  accept(id: any) {
    this.service.accept(id);
  }
  reject(id: any) {
    this.service.reject(id);
  }
}
