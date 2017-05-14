// are you sure? --> display confirm dialog
main.directive('ngConfirmClick', [
    function() {
        return {
            link: function(scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function(event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }
])
.directive('fileModel', ['$parse', function($parse){
    return {
        retrict: 'A',
        link: function(scope, element, attrs) {
            var parseFile = $parse(attrs.fileModel);
            var parseFileSetter = parseFile.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    parseFileSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])


/*filter*/
// filter for loop number range
main.filter('range', function(){
    return function(input, total){
        total = parseInt(total);

        for(var i=0; i<total; i++){
            if(i<10){
                input.push('0'+i);
            } else {
                input.push(i)
            }            
        }
        return input;
    }
})
.filter('htmlToPlaintext', function() {
    return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
})
// .directive('dateInput', function(dateFilter) {
//     return {
//         require: 'ngModel',
//         template: '<input type="date"></input>',
//         replace: true,
//         link: function(scope, elm, attrs, ngModelCtrl) {
//             ngModelCtrl.$formatters.unshift(function(modelValue) {
//                 return dateFilter(modelValue, 'dd-MM-yyyy');
//             });

//             ngModelCtrl.$parsers.unshift(function(viewValue) {
//                 return new Date(viewValue);
//             });
//         },
//     };
// })

