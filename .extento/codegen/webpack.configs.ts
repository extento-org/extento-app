// @ts-nocheck

import { config } from '@extento.api/utils.strip_build';

import * as admin from '@_workspace/admin/config';
import * as candidate from '@_workspace/candidate/config';
import * as devops from '@_workspace/devops/config';
import * as manager from '@_workspace/manager/config';
import * as tester from '@_workspace/tester/config';

export default {
    admin: config<typeof admin>('admin', admin),
    candidate: config<typeof candidate>('candidate', candidate),
    devops: config<typeof devops>('devops', devops),
    manager: config<typeof manager>('manager', manager),
    tester: config<typeof tester>('tester', tester),
};
