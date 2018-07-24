export const appConfig = {
    apiUrl: 'http://localhost:4000',
    connectionString: "mongodb://localhost:27017/eqa-app",
    fromPersonName: "Team IQA",
    fromPersonMailId: "iqaTeamMailId"
};

export const adminConfig = {
    RequestStatus: {
        NEW:"New",
        PANEL_ASSIGNED: "PanelAssigned",
        IN_PROGRESS:'InProgress',
        COMPLETED:'Completed'
    },
    ActionList: {
        AdminTeamRequest: 'HOME',
        AdminTeamRequestNew: 'IQA NEW REQUESTS',
        AdminTeamRequestPending: 'PANEL ASSIGNED REQUESTS',
        AdminTeamRequestInProgress:'IQA REQUEST IN PROGRESS',
        AdminTeamRequestCompleted:'IQA COMPLETED REQUESTS',
        TeamRequestDetails: 'REQUEST_DETAIL',
        AddPanel: 'ADD PANEL',
        AddTeam: 'ADD TEAM',
        AddSkill: 'ADD Skills'
    }
};