import background_apis from '@_codegen/webpack.background_apis';
import define_listener from '@_core/api/worker.define_listener';

export default function(): void { define_listener<typeof background_apis>(background_apis); };