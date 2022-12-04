import { background_api } from '../utils/strip_build';

import * as admin from '@workspaces/admin/background_api';
import * as candidate from '@workspaces/candidate/background_api';
import * as devops from '@workspaces/devops/background_api';
import * as manager from '@workspaces/manager/background_api';
import * as tester from '@workspaces/tester/background_api';

export default {
    admin: background_api<typeof admin>('admin', admin),
    candidate: background_api<typeof candidate>('candidate', candidate),
    devops: background_api<typeof devops>('devops', devops),
    manager: background_api<typeof manager>('manager', manager),
    tester: background_api<typeof tester>('tester', tester),
};
