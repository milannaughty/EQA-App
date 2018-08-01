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

    static getNthIndexOfString(string, subString, index) {
        return string.split(subString, index).join(subString).length;
     } 
}