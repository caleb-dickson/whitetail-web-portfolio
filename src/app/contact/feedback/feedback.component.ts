import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Rise_FadeUp } from 'src/app/app.animations';
import { environment } from 'src/environments/environment';

import { ContactSuccessComponent } from '../contact-success/contact-success.component';

import { ContactService } from '../contact.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  animations: [Rise_FadeUp]
})
export class FeedbackComponent {
  @ViewChild('feedbackForm') feedbackForm: NgForm;
  defaultSelect = 'home';
  formValid = true;

  constructor(
    private dialog: MatDialog,
    private contactService: ContactService
  ) {}

  validateContactForm() {
    if (this.feedbackForm.hasError) {
      return 'was-validated';
    }
  }

  onFeedbackSubmit(feedbackForm: NgForm) {
    const senderEmail = feedbackForm.value.senderEmail;
    const senderName = feedbackForm.value.senderName;
    const senderTitle = feedbackForm.value.senderTitle;
    const subj = feedbackForm.value.subject;
    const message = feedbackForm.value.message;
    const feedbackMessage = {
      to: environment.as2DS5Dds6d,
      bcc: feedbackForm.value.senderEmail,
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
    if (this.feedbackForm.valid) {
      this.formValid = true;
      this.contactService.submitFeedback(feedbackMessage);
      this.feedbackForm.resetForm();
      this.dialog.open(ContactSuccessComponent);
    } else {
      this.formValid = false;
    }
  }
}
