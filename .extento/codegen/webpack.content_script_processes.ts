import { content_script_process } from '../utils/strip_build';

import * as admin from '@_workspace/admin/content_script_process';
import * as candidate from '@_workspace/candidate/content_script_process';
import * as devops from '@_workspace/devops/content_script_process';
import * as manager from '@_workspace/manager/content_script_process';
import * as tester from '@_workspace/tester/content_script_process';

export default {
    admin: content_script_process<typeof admin>('admin', admin),
    candidate: content_script_process<typeof candidate>('candidate', candidate),
    devops: content_script_process<typeof devops>('devops', devops),
    manager: content_script_process<typeof manager>('manager', manager),
    tester: content_script_process<typeof tester>('tester', tester),
};
