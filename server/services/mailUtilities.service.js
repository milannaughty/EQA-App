var config = require('config.json');
var utilitiesServiceObject = require('./utililties.service');
var mailUtilitiesService = {};

mailUtilitiesService.validateFromMailIdBeforeSendingMail = validateFromMailIdBeforeSendingMail;
mailUtilitiesService.validateToListBeforeSendingMail = validateToListBeforeSendingMail;
mailUtilitiesService.validateCcListBeforeSendingMail = validateCcListBeforeSendingMail;
mailUtilitiesService.validateMailSubjectBeforeSendingMail = validateMailSubjectBeforeSendingMail;
mailUtilitiesService.validateMailContentBeforeSendingMail = validateMailContentBeforeSendingMail;
mailUtilitiesService.getBoxWhereContentCanBePut = getBoxWhereContentCanBePut;
mailUtilitiesService.getTabularData = getTabularData;
mailUtilitiesService.GetFromMailID = GetFromMailID;
mailUtilitiesService.FormulateEmailBodyTemplate = FormulateEmailBodyTemplate;

module.exports = mailUtilitiesService;



function validateFromMailIdBeforeSendingMail(reqParameter) {
    console.log(reqParameter.fromPersonMailId);
    var keysOfJson = utilitiesServiceObject.getAllKeysOfJSON(reqParameter);
    var errorFlag = { "keyNotPresent": "", "listIsEmpty": "" };
    if (keysOfJson.indexOf("fromPersonMailId") < 0)
        errorFlag.keyNotPresent = "true";
    if (reqParameter.fromPersonMailId == "")
        errorFlag.listIsEmpty = "true";
    return errorFlag;
}

function validateToListBeforeSendingMail(reqParameter) {
    var keysOfJson = utilitiesServiceObject.getAllKeysOfJSON(reqParameter);
    var errorFlag = { "keyNotPresent": "", "listIsEmpty": "" };
    if (keysOfJson.indexOf("toPersonMailId") < 0)
        errorFlag.keyNotPresent = "true";
    if (reqParameter.toPersonMailId == "")
        errorFlag.listIsEmpty = "true";
    return errorFlag;
}

function validateCcListBeforeSendingMail(reqParameter) {
    var keysOfJson = utilitiesServiceObject.getAllKeysOfJSON(reqParameter);
    var errorFlag = { "keyNotPresent": "", "listIsEmpty": "" };
    if (keysOfJson.indexOf("ccPersonList") < 0)
        errorFlag.keyNotPresent = "true";
    if (reqParameter.ccPersonList == "")
        errorFlag.listIsEmpty = "true";
    return errorFlag;
}

function validateMailSubjectBeforeSendingMail(reqParameter) {
    var keysOfJson = utilitiesServiceObject.getAllKeysOfJSON(reqParameter);
    var errorFlag = { "keyNotPresent": "", "listIsEmpty": "" };
    if (keysOfJson.indexOf("mailSubject") < 0)
        errorFlag.keyNotPresent = "true";
    if (reqParameter.mailSubject == "")
        errorFlag.listIsEmpty = "true";
    return errorFlag;
}

function validateMailContentBeforeSendingMail(reqParameter) {
    var keysOfJson = utilitiesServiceObject.getAllKeysOfJSON(reqParameter);
    var errorFlag = { "keyNotPresent": "", "listIsEmpty": "" };
    if (keysOfJson.indexOf("mailContent") < 0)
        errorFlag.keyNotPresent = "true";
    if (reqParameter.mailContent == "")
        errorFlag.listIsEmpty = "true";
    return errorFlag;
}

function getBoxWhereContentCanBePut(contentTobePutInBox) {
    return `<div class=WordSection1><p class=MsoNormal><o:p>&nbsp;</o:p></p><table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0 style='border-collapse:collapse;border:none'><tr><td valign=top style='border:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt'><p class=MsoNormal>${contentTobePutInBox}<o:p></o:p></p></td></tr></table><p class=MsoNormal><o:p>&nbsp;</o:p></p></div>`;
}

/**
 * This function generates table from recieved text. 
 * @param {it expects rowSeperator[i.e. 4th parameter] seperated string} csString 
 * @param {Number of max columns that has to formed} maxColumns 
 * @param {It has single header} headername 
 * @param {it is sub headers string seperated with rowSeperator} subHeaders
 * @param {it is a special character with which you wan't to seperate incoming string[i.e. 1st parameter]  } rowSeperator 
 */
function getTabularData(csString, maxColumns, headername, subHeaders, rowSeperator) {
    //debugger;
    var result = "";
    var data = csString.split(rowSeperator);
    result += `<table border='1'><thead>
                <tr>
                    <th colspan='${maxColumns}'>${headername}</th>
                </tr>`;
    if (maxColumns > 1) {
        var headerData = subHeaders.split(rowSeperator);
        var headerIndex = 0;
        result += '<tr>';
        while (headerIndex < headerData.length) {
            result += `<th>${headerData[headerIndex]}</th>`;
            headerIndex++;
        }
        result += '</tr>';
    }
    result += `</thead><tbody>`;
    var dataIndex = 0;
    var ele = "";
    var rowNum = 1;
    while (dataIndex < data.length) {//data iterating loop

        var colNum = 1;
        if (rowNum % 2 == 0)
            result += "<tr>";
        else
            result += "<tr>";

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
 * Method to return mail id configured to send for IQA mails.
 */
function GetFromMailID() {
    return '"IQA TEAM" <jaydipjadhav26@gmail.com>'
}

function getIQAMailSignature(param) {
    // var signatureText = `<BR><B>Thanks</B>,<BR>`;
    // if (param == undefined)
    //     return signatureText += `<B>Team IQA</B>`;
    // else
    //     return signatureText += '<B>' + param + '</B>';
    return `<br><br><hr><b>Thanks,<br>	IQA IT Support,<br>	NIHILENT LIMITED.<b></div>`
}

/**
 * Method to return formulated mail body.
 */
function FormulateEmailBodyTemplate(body) {

    return `<html><head><style>
    .container {padding: 2%; box-shadow: inset 0px 0px 4px 1px darkgrey;color: #1F3864;font-family: "Calibri",sans-serif;overflow-wrap: break-word;width: 50%;min-height: 220px;font-size: 11.0pt;line-height: 21px;}
    </style></head><div class='container'>	${body} <br>
    For more details please login to <a href='${config.WebURL}'>IQA Portal</a>.
    ` + getIQAMailSignature();
}