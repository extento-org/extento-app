import { ui } from '../utils/strip_build';

import * as admin from '@workspaces/admin/ui';
import * as candidate from '@workspaces/candidate/ui';
import * as devops from '@workspaces/devops/ui';
import * as manager from '@workspaces/manager/ui';
import * as tester from '@workspaces/tester/ui';

export default {
    admin: ui<typeof admin>('admin', admin),
    candidate: ui<typeof candidate>('candidate', candidate),
    devops: ui<typeof devops>('devops', devops),
    manager: ui<typeof manager>('manager', manager),
    tester: ui<typeof tester>('tester', tester),
};
