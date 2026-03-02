import {MultilingualNameModel} from '../../../../core/models/multilingual-name.model';

export class CategoriesRequestModel {
  id:string;
  name:MultilingualNameModel = new MultilingualNameModel()
}
