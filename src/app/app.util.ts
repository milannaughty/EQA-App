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


}