export const appConfig = {
    apiUrl: 'http://172.16.20.245:4000',
    connectionString: "mongodb://localhost:27017/eqa-app",
    fromPersonName: "Team IQA",
    fromPersonMailId: "iqaTeamMailId",
    initialPassword: 'nihilent@123'
};

export const adminConfig = {
    RequestStatus: {
        NEW: "New",
        PANEL_ASSIGNED: "PanelAssigned",
        IN_PROGRESS:'InProgress',
        COMPLETED:'Completed',
        VERIFIED_BY_DEV_PANEL:'VerifiedByDevPanel',
        VERIFIED_BY_QA_PANEL:'VerifiedByQAPanel',
        VERIFIED_BY_TEAM:'VerifiedByTeam',
        REJECTED:'Rejected',
        CLOSE:'Close',
        OPEN:'Open',
        UNDER_VERIFICATION:'UnderVerification'

    },
    ActionList: {
        AdminTeamRequest: 'HOME',
        AdminTeamRequestNew: 'IQA NEW REQUESTS',
        AdminTeamRequestPending: 'PANEL ASSIGNED REQUESTS',
        AdminTeamRequestInProgress: 'IQA REQUEST IN PROGRESS',
        AdminTeamRequestCompleted: 'IQA COMPLETED REQUESTS',
        AdminTeamRequestRejected: 'IQA REJECTED REQUESTS',
        TeamRequestDetails: 'REQUEST_DETAIL',
        AddPanel: 'ADD PANEL',
        AddTeam: 'ADD TEAM',
        AddSkill: 'ADD Skills'
    }
};

export const userConfig = {
    ActionList: {
        'EQANewRequests': 'IQA New Requests',
        'EQASummary': 'IQA Summary',
        'AssociateRequestDetail': 'Request Detail',
        'InitiateEQARequest': 'Initiate IQA Request',
        'TeamEQARequest': 'Request History',
        'TeamRequestDetail': 'Request Summary Detail',
        'PanelList': 'Panel List',
        'PanelDetail': 'Panel Detail',
        'ResetPassword': 'RESET PASSWORD',
        'TeamCheckList':'CHECKLIST REVIEW'
    }
};