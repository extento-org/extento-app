module.exports = {
    ui_ordering: [
        "tester",
        "manager",
        "candidate",
        "admin",
        "devops"
    ],
    selective_builds: {
        QA: [
            "tester",
            "candidate"
        ],
        BOSS: [
            "manager",
            "admin"
        ],
        NEW_GUY: [
            "devops",
            "candidate"
        ],
        CEO: [
            "admin",
            "candidate",
            "manager",
            "tester"
        ]
    }
};