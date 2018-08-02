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

    static ShowInfoAlert(title, htmlContent) {
        swal({
            type: 'info',
            html: htmlContent,
            showCloseButton: true,
            title: title
        })
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

    static GetTabularData(csString, maxColumns, headername) {
        debugger;
        var result = "";
        var data = csString.split(',');
        result += "<table class='table'><tbody>";
        var dataIndex = 0;
        var ele = "";
        var rowNum = 1;
        while (dataIndex < data.length) {//data iterating loop

            var colNum = 1;
            if (rowNum % 2 == 0)
                result += "<tr class='active'>";
            else
                result += "<tr class='active'>";

            while (colNum <= maxColumns) {//loop for maxColumns

                if (dataIndex >= data.length) {//empty TD's at the end
                    result += "<td> </td>";
                } else {
                    ele = data[dataIndex];
                    result += "<td>" + ele + "</td>";
                }

                dataIndex++;
                colNum++;
            }//loop for maxColumns 
            result += "</tr>";
            rowNum++;
        }//data iterating loop
        result += "<tbody></table>";

        return result;
    }


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
                emailItem = emailItem.split('@')[0].replace('.', ' ');
            }).join(',');
        }
        else {
            userNameList = commaSepratedEmailIds.split('@')[0].replace('.', ' ');
        }
        return userNameList;
    }
}