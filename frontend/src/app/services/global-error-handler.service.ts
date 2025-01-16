import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService {

  constructor() { }

  handleError(error: any): void {

    console.error(error);
  }
}
