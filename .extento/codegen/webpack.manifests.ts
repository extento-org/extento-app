import { manifest } from '@extento.api/utils.strip_build';

import * as admin from '@_workspace/admin/manifest.json';
import * as candidate from '@_workspace/candidate/manifest.json';
import * as devops from '@_workspace/devops/manifest.json';
import * as manager from '@_workspace/manager/manifest.json';
import * as tester from '@_workspace/tester/manifest.json';

export default {
    admin: manifest<typeof admin>('admin', admin),
    candidate: manifest<typeof candidate>('candidate', candidate),
    devops: manifest<typeof devops>('devops', devops),
    manager: manifest<typeof manager>('manager', manager),
    tester: manifest<typeof tester>('tester', tester),
};
