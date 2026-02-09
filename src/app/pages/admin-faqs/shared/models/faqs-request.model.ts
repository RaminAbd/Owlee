import {MultilingualNameModel} from '../../../../core/models/multilingual-name.model';

export class FaqsRequestModel {
  id: string;
  title: MultilingualNameModel = new MultilingualNameModel();
  body: MultilingualNameModel = new MultilingualNameModel();
  faqType: number;
}
