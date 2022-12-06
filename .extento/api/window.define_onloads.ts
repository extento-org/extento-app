import onloads from '@_codegen/webpack.onloads';
import define_onloads from '@_core/api/window.define_onloads';

export default function(): void { define_onloads(onloads); };