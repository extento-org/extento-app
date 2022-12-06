import { ui } from '../utils/strip_build';

import * as admin from '@_workspace/admin/ui';
import * as candidate from '@_workspace/candidate/ui';
import * as devops from '@_workspace/devops/ui';
import * as manager from '@_workspace/manager/ui';
import * as tester from '@_workspace/tester/ui';

export default {
    admin: ui<typeof admin>('admin', admin),
    candidate: ui<typeof candidate>('candidate', candidate),
    devops: ui<typeof devops>('devops', devops),
    manager: ui<typeof manager>('manager', manager),
    tester: ui<typeof tester>('tester', tester),
};
