import {MultilingualNameModel} from '../../../../core/models/multilingual-name.model';

export class TutorialsRequestModel {
  id: string;
  title: MultilingualNameModel = new MultilingualNameModel();
  body: MultilingualNameModel = new MultilingualNameModel();
  url:string
}
