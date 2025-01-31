import {AdminHeaderComponent} from '../../shared/components/headers/admin-header/admin-header.component';
import {EducatorHeaderComponent} from '../../shared/components/headers/educator-header/educator-header.component';
import {StudentHeaderComponent} from '../../shared/components/headers/student-header/student-header.component';

export const HeaderComponentByRole = {
  'Admin':AdminHeaderComponent,
  'Educator':EducatorHeaderComponent,
  'Student':StudentHeaderComponent,
};
