import { WorkspaceName } from '@codegen/webpack.workspaces';
import url_match_patterns from '@extento/utils/url_match_patterns';
import get_manifest_values from '@extento/shared/get_manifest_values';

const manifest_matches_check = (
    workspace_name: WorkspaceName,
    href: string,
): boolean => get_manifest_values(workspace_name, 'matches')
    .some((value: any) => {
        const nonmatches = value
            .filter((match: any) => !url_match_patterns(match, href));

        return nonmatches.length !== value.length;
    });

export default manifest_matches_check;
