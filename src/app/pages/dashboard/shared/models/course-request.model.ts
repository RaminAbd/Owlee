import { FileModel } from '../../../../core/models/File.model';

export class CourseRequestModel {
  id: string;
  educatorId: string;
  systemLanguageId: string;
  systemLanguageName: string;
  image: FileModel = new FileModel();
  name: string;
  description: string;
  educator:string
  rating: any;
  maximumSeats: any;
  minimumSeats: any;
  price: any;
  startDate: any;
  endDate: any;
  lastSubscriptionDate: any;
  isOpen: boolean = false;
  learningPoints: any[]=[];
}
