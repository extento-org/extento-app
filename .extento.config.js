module.exports = {
    manifest: {
        name: '__name__',
        version: '0.0.1',
        web_accessible_resources: [],
        popup_name: 'Popup',
        content_scripts: [],
        allowed_extensions: [],
        required_permissions: [],
    },
    ui_ordering: [
        'admin',
        'tester',
        'manager',
        'candidate',
        'devops'
    ],
    selective_builds: {
        QA: [
            'tester',
            'candidate'
        ],
        BOSS: [
            'manager',
            'admin'
        ],
        NEW_GUY: [
            'devops',
            'candidate'
        ],
        CEO: [
            'admin',
            'candidate',
            'manager',
            'tester'
        ]
    }
};
