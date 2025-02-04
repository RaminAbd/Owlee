import {RangeItemModel} from './range-item.model';

export class RangeRequestModel {
  groupId: string
  from: string
  to: string
  items: RangeItemModel[]=[]
}
