import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firebaseStoreEnabled } from '../../catalog-mode';
@Component({selector:'app-legal',standalone:true,imports:[RouterLink],templateUrl:'./legal.html'})
export class Legal {
  readonly firebaseStoreEnabled = firebaseStoreEnabled;
}
