import { onload } from '@_package/utils/strip_build';

import * as admin from '@_workspace/admin/onload';
import * as candidate from '@_workspace/candidate/onload';
import * as devops from '@_workspace/devops/onload';
import * as manager from '@_workspace/manager/onload';
import * as tester from '@_workspace/tester/onload';

export default {
    admin: onload<typeof admin>('admin', admin),
    candidate: onload<typeof candidate>('candidate', candidate),
    devops: onload<typeof devops>('devops', devops),
    manager: onload<typeof manager>('manager', manager),
    tester: onload<typeof tester>('tester', tester),
};
