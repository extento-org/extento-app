import { manifest } from '../utils/strip_build';

import * as admin from '@workspaces/admin/manifest.json';
import * as candidate from '@workspaces/candidate/manifest.json';
import * as devops from '@workspaces/devops/manifest.json';
import * as manager from '@workspaces/manager/manifest.json';
import * as tester from '@workspaces/tester/manifest.json';

export default {
    admin: manifest<typeof admin>('admin', admin),
    candidate: manifest<typeof candidate>('candidate', candidate),
    devops: manifest<typeof devops>('devops', devops),
    manager: manifest<typeof manager>('manager', manager),
    tester: manifest<typeof tester>('tester', tester),
};
