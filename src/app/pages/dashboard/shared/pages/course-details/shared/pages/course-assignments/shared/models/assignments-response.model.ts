export class AssignmentsResponseModel {
  id: string;
  title: string;
  description: string;
  availableFrom: string;
  availableTo: any;
  totalStudents: number;
  submittedStudents: number;
  groups: string;
  isPast: boolean;
}
