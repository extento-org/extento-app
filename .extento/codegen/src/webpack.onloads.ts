import { onload } from '../utils/strip_build';

import * as admin from '@workspaces/admin/onload';
import * as candidate from '@workspaces/candidate/onload';
import * as devops from '@workspaces/devops/onload';
import * as manager from '@workspaces/manager/onload';
import * as tester from '@workspaces/tester/onload';

export default {
    admin: onload<typeof admin>('admin', admin),
    candidate: onload<typeof candidate>('candidate', candidate),
    devops: onload<typeof devops>('devops', devops),
    manager: onload<typeof manager>('manager', manager),
    tester: onload<typeof tester>('tester', tester),
};
