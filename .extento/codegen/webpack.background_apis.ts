import { background_api } from '@_package/utils/strip_build';

import * as admin from '@_workspace/admin/background_api';
import * as candidate from '@_workspace/candidate/background_api';
import * as devops from '@_workspace/devops/background_api';
import * as manager from '@_workspace/manager/background_api';
import * as tester from '@_workspace/tester/background_api';

export default {
    admin: background_api<typeof admin>('admin', admin),
    candidate: background_api<typeof candidate>('candidate', candidate),
    devops: background_api<typeof devops>('devops', devops),
    manager: background_api<typeof manager>('manager', manager),
    tester: background_api<typeof tester>('tester', tester),
};
