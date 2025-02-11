import {inject, Injectable} from '@angular/core';
import {TransactionResultComponent} from './transaction-result.component';
import {TransactionsApiService} from './shared/services/transactions.api.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionResultService {
  private service:TransactionsApiService = inject(TransactionsApiService);
  component:TransactionResultComponent;
  constructor() { }

  checkStatus(){
    this.service.checkStatus(this.component.id).subscribe(resp=>{
      this.component.success = resp.data.result;
      this.component.loading = false;
    })
  }
}
