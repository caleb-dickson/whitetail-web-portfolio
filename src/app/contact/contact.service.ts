import { Injectable } from '@angular/core';

import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private firestore: Firestore) {}

  submitFeedback(feedbackForm: object) {
    const feedbackSubmitRef = collection(this.firestore, 'contactSubmit');
    return addDoc(feedbackSubmitRef, feedbackForm);
  }

  submitContactForm(contactMessage: object) {
    const contactSubmitRef = collection(this.firestore, 'contactSubmit');
    return addDoc(contactSubmitRef, contactMessage);
  }
}
