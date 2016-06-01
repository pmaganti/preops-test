
/**
 * Created by jgandi on 19/5/16.
 */

angular.module('barrick')

    .controller('InspectionDetailController',['$scope','modalService','httpService','$stateParams',function($scope, modalService, httpService,$stateParams){
        var machine = $stateParams.machine;
        $scope.machine_type = $stateParams.machine_type;console.log( $stateParams.machine_type)
        $scope.elements = [];

        $scope.tabs = [{
            title: 'Start Shift',
            url: 'one.tpl.html'
        }, {
            title: 'End Shift',
            url: 'two.tpl.html'
        }];

        $scope.currentTab = 'one.tpl.html';
        $scope.currentTabTitle = 'Start Shift';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
            $scope.currentTabTitle = tab.title;
            $scope.changeConclusion();
        }

        $scope.isActiveTab = function(tabUrl) {
            console.log($scope.currentTab);
            return tabUrl == $scope.currentTab;
        }

        var type = 'truck';

        httpService.getInspectionDetails(machine)
            .then(function successCallback(response) {
                $scope.mIndex = 0;

                $scope.elements = response.data;
                $scope.changeConclusion();
            }, function errorCallback(response) {
                console.log("error",response);
            });

        $scope.deleteElement = function(index){
            modalService.deleteModal($scope,type,index,function(success){
                if(success){
                    $scope.elements.splice(index,1);
                }
            });
        };

        $scope.editElement = function(index){
            modalService.editModal($scope,type,index,function(success,response){
                if(success) {
                    $scope.elements[index].rev = response.rev;
                    $scope.elements[index].docs = response.docs;
                }
            });
        };

        $scope.changeInspection = function(index){

            $scope.mIndex = index;
            $scope.changeConclusion();


        };
        $scope.changeConclusion = function(){
           if($scope.elements[$scope.mIndex]){
               var docs = $scope.elements[$scope.mIndex].docs;
               if($scope.currentTabTitle == 'End Shift'){

                   $scope.machineconclusion = (docs.endOfShift && docs.endOfShift.conclusion)?docs.endOfShift.conclusion:"-";
               }else{
                   $scope.machineconclusion = (docs.startOfShift && docs.startOfShift.conclusion)?docs.startOfShift.conclusion:"-";
               }
           }


        };

        $scope.addElement = function(){
            modalService.addModal($scope,type,function(success,response){
                if(success){
                    $scope.elements.push(response);
                }
            });
        };
        $scope.printReport = function(){
            var styles = "<style>table, thead, tr, td, th {border: 1px black solid;text-align: center;}.text-left * {text-align: left}</style>";

            var shits = "";
            var tab = "<table><thead><th>Question</th><th>Start of shift</th><th>End of shift</th></thead>";

            var docs = $scope.elements[$scope.mIndex].docs;
            var startShiftQuestion=[],endShiftQuestion=[];
            var operator = docs.inspectedBy.firstname+" "+docs.inspectedBy.lastname;
            var equipment = docs.machine.mSerial;
            var startTime = "-";var endTime = "-", startEng="-", endEng="-", parking="-";
            if(docs.startOfShift){
                var data = docs.startOfShift;
                 startShiftQuestion = data.questions;
                 startTime = data.startTime;
                 startEng = data.startEngHours;
            }
            if(docs.endOfShift){
                var data = docs.endOfShift;
                endShiftQuestion = data.questions;
                endTime = data.endTime;
                endEng = data.endEngHours;
                parking = data.locationOfUnitAtEndOfShift;
            }

            var dummy = "";

            $.each(startShiftQuestion,function(i,question){
                var ques = question.question;
                var ans_start = question.answer;
                var ans_end = endShiftQuestion.length?endShiftQuestion[i].answer:"-"
                dummy +="<tr><td>"+ques+"</td><td>"+ans_start+"</td><td>"+ans_end+"</td></tr>"
            });

            if(dummy.length==0){
                $.each(endShiftQuestion,function(i,question){
                    var ques = question.question;
                    var ans_end = question.answer;
                    var ans_start = startShiftQuestion.length?startShiftQuestion[i].answer:"-"
                    dummy +="<tr><td>"+ques+"</td><td>"+ans_start+"</td><td>"+ans_end+"</td></tr>"
                });
            }
            tab += dummy;
            tab +="</table>"
       var end_dummy = '<br><br><br><br><br><table class="text-left">'+
        '<tr><td colspan="2">Operator : <span>'+operator+'</span></td></tr>'+
        '<tr><td colspan="2">Equipment No : <span>'+equipment+'</span></td></tr>'+
       /* '<tr><td colspan="2">Supervisor Initial : <span>''</span></td></tr>'+*/
        '<tr><td>Start Time : <span>'+startTime+'</span></td><td>End Time : <span>'+endTime+'</span></td></tr>'+
        '<tr><td>Start Eng Hrs : <span>'+startEng+'</span></td><td>End Eng Hrs : <span>'+endEng+'</span></td></tr>'+
        '<tr><td colspan="2">Location of Unit at end of shift : <span>'+parking+'</span></td></tr>'+
        '</table>'
            printContents = tab+end_dummy+styles;
            var popupWin = window.open('', '_blank');
            popupWin.document.open();
            popupWin.document.write('<html><head></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();

        };

    }]);