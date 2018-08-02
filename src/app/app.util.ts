import swal from "sweetalert2"
export class CommonUtil {

    static CheckListDetails = [
        { _Id: 1, CheckListItem: 'Commenting & Documentatio', Description: 'Code needs to be properly documented and only keep the necessary commented code.' },
        { _Id: 2, CheckListItem: 'Consistent indentation', Description: 'Use tools like sonar qube for code review.' },
        { _Id: 3, CheckListItem: 'Consistent naming scheme', Description: 'Follow the consistent naming standards all over application.' },
        { _Id: 4, CheckListItem: 'Code reusability', Description: 'Code duplication should be avoided wherever possible. Try to reuse the existing code.' },
        { _Id: 5, CheckListItem: 'Limit the length of functions', Description: 'Don’t put too much code into single function. Try to make multiple functions as per logical grouping of code.' },
        { _Id: 6, CheckListItem: 'File and folder organisation', Description: 'Files and folders should be organised properly in application.' },
        { _Id: 7, CheckListItem: 'File and folder organisation', Description: 'Files and folders should be organised properly in application.' }]

    static GetFilteredRequestList(requestList, status) {
        return requestList.filter(x => x.status == status)
    }

    static ShowSuccessAlert(msg) {
        swal('success', msg, 'success')
    }

    static ShowErrorAlert(msg) {
        swal('error', msg, 'error')
    }

    static ShowInfoAlert(msg) {
        swal('Attention!!', msg, 'info')
    }
    /**
     * 
     * @param string 
     * @param subString 
     * @param index 
     */
    static getNthIndexOfString(string, subString, index) {
        return string.split(subString, index).join(subString).length;
    }

}

export class EmailManager {

    /**
     * This method is used to get comma seprated list of email ids
     * @param arrayObject 
     */
    static GetCommaSepratedEmailIDs(arrayObject: string[]) {
        return arrayObject.filter(x => { if (x) return x; }).join(',')
    }

    /**
     * Method returns email subject line for reject IQA request operation
     * @param sprintName 
     * @param rejectedByPanelName 
     */
    static GetRejectRequestSubjectLine(sprintName: string, rejectedByPanelName: string) {
        return `IQA Team | IQA Request Rejected For Sprint ${sprintName} By Panel ${rejectedByPanelName}`;
    }

    /**
     * Method returns single or multiple User name(s) in comma separated list
     * @param commaSepratedEmailIds 
     */
    static GetUserNameFromCommaSepratedEmailIds(commaSepratedEmailIds: string) {
        var userNameList;
        if (commaSepratedEmailIds.indexOf(',') > -1) {
            userNameList = commaSepratedEmailIds.split(',').map(function (emailItem) {
                return emailItem.split('@')[0].replace('.', ' ');
            }).join(',');
        }
        else {
            userNameList = commaSepratedEmailIds.split('@')[0].replace('.', ' ');
        }
        return userNameList;
    }

}