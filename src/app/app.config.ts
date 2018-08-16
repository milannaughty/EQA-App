export const appConfig = {
    apiUrl: 'http://172.16.20.245:4000',
    connectionString: "mongodb://172.16.20.245:27017/eqa-app",
    fromPersonName: "Team IQA",
    fromPersonMailId: "iqaTeamMailId",
    initialPassword: 'nihilent@123'
};

export const adminConfig = {
    RequestStatus: {
        NEW: { DBStatus: 'New', DisplayStatus: 'New Request' },
        PANEL_ASSIGNED: { DBStatus: "PanelAssigned", DisplayStatus: "Panel Assigned" },
        IN_PROGRESS: { DBStatus: 'InProgress', DisplayStatus: 'Req. Inprogress' },
        COMPLETED:  { DBStatus: 'Completed', DisplayStatus: 'IQA Completed' },
        VERIFIED_BY_DEV_PANEL:{ DBStatus: 'VerifiedByDevPanel', DisplayStatus: 'Verified By Dev Panel' } ,
        VERIFIED_BY_QA_PANEL: { DBStatus: 'VerifiedByQAPanel', DisplayStatus: 'Verified By QA Panel' },
        VERIFIED_BY_TEAM: { DBStatus: 'VerifiedByTeam', DisplayStatus: 'Verified By Team' },
        REJECTED: { DBStatus: 'Rejected', DisplayStatus: 'Req. Rejected' },
        CLOSE: 'Close',
        OPEN: 'Open',
        UNDER_VERIFICATION: { DBStatus: 'UnderVerification', DisplayStatus: 'Under Review' }

    },
    ActionList: {
        AdminTeamRequest: 'HOME',
        AdminTeamRequestNew: 'IQA NEW REQUESTS',
        AdminTeamRequestPending: 'PANEL ASSIGNED REQUESTS',
        AdminTeamRequestInProgress: 'IQA REQUEST IN PROGRESS',
        AdminTeamRequestCompleted: 'IQA COMPLETED REQUESTS',
        AdminTeamRequestRejected: 'IQA REJECTED REQUESTS',
        AdminTeamRequestUnderVerification: 'IQA REQUESTS UNDER VERIFICATION',
        TeamRequestDetails: 'REQUEST_DETAIL',
        AddPanel: 'ADD PANEL',
        AddTeam: 'ADD TEAM',
        AddSkill: 'ADD Skills',
        PanelList: 'PANEL LIST'
    }
};

export const userConfig = {
    ActionList: {
        'EQANewRequests': 'Assigned Request',
        'EQASummary': 'IQA Summary',
        'AssociateRequestDetail': 'Request Detail',
        'InitiateEQARequest': 'Initiate IQA Request',
        'TeamEQARequest': 'Request History',
        'TeamRequestDetail': 'Request Summary Detail',
        'PanelList': 'Panel List',
        'PanelDetail': 'Panel Detail',
        'ResetPassword': 'RESET PASSWORD',
        'TeamCheckList': 'CHECKLIST REVIEW'
    }
};