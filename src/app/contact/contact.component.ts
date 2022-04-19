import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { environment } from 'src/environments/environment';
import { Sweep_FadeFromLeft, Sweep_FadeFromRight } from '../app.animations';

import { ContactSuccessComponent } from './contact-success/contact-success.component';

import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  animations: [Sweep_FadeFromLeft, Sweep_FadeFromRight]
})
export class ContactComponent {
  @ViewChild('contactForm') contactForm: NgForm;

  formValid = true;
  phoneNumber: string = environment.asd9s6d7fdw;

  constructor(
    private dialog: MatDialog,
    private contactService: ContactService
  ) {}

  validateContactForm() {
    if (this.contactForm.hasError) {
      return 'was-validated';
    }
  }

  openDialog() {
    this.dialog.open(ContactSuccessComponent);
  }

  onContactSubmit(contactForm: NgForm) {
    const senderEmail = contactForm.value.senderEmail;
    const senderName = contactForm.value.senderName;
    const senderTitle = contactForm.value.senderTitle;
    const subj = contactForm.value.subject;
    const message = contactForm.value.message;
    const contactMessage = {
      to: environment.as2DS5Dds6d,
      cc: contactForm.value.senderEmail,
      message: {
        subject: subj,
        html:
          '<p>' +
          'Here is a copy of the message you sent. Thanks!' +
          '</p>' +
          '<p>' +
          'From ' +
          senderName +
          ', ' +
          senderTitle +
          ' (' +
          senderEmail +
          ').' +
          '<br/>' +
          '</p>' +
          '<p>' +
          message +
          '</p>',
      },
    };
    if (this.contactForm.valid) {
      this.formValid = true;
      this.contactService.submitContactForm(contactMessage);
      this.contactForm.resetForm();
      this.dialog.open(ContactSuccessComponent);
    } else {
      this.formValid = false;
    }
  }
}
