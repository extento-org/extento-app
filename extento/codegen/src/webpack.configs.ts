import { config } from '../utils/strip_build';

import * as admin from '@workspaces/admin/config';
import * as candidate from '@workspaces/candidate/config';
import * as devops from '@workspaces/devops/config';
import * as manager from '@workspaces/manager/config';
import * as tester from '@workspaces/tester/config';

export default {
    admin: config<typeof admin>('admin', admin),
    candidate: config<typeof candidate>('candidate', candidate),
    devops: config<typeof devops>('devops', devops),
    manager: config<typeof manager>('manager', manager),
    tester: config<typeof tester>('tester', tester),
};
