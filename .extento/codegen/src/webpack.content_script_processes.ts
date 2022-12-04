import { content_script_process } from '../utils/strip_build';

import * as admin from '@workspaces/admin/content_script_process';
import * as candidate from '@workspaces/candidate/content_script_process';
import * as devops from '@workspaces/devops/content_script_process';
import * as manager from '@workspaces/manager/content_script_process';
import * as tester from '@workspaces/tester/content_script_process';

export default {
    admin: content_script_process<typeof admin>('admin', admin),
    candidate: content_script_process<typeof candidate>('candidate', candidate),
    devops: content_script_process<typeof devops>('devops', devops),
    manager: content_script_process<typeof manager>('manager', manager),
    tester: content_script_process<typeof tester>('tester', tester),
};
