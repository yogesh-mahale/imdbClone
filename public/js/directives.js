/**
 * Table sorting asc and desc
 */
app.directive('sort', function() {
    return {
        restrict: 'A',
        transclude: true,
        templateUrl: '../views/directive/sort/sort.html',
        scope: {
            by: '=',
            reverse : '=',
            orderBy: '=orderBy',
            columnName : '=columnName',
            onClickSort: '&onClick'
        },
        link: function(scope, element, attrs) {
            // Show asc/desc icon as per current order by status
            if (scope.orderBy) {
                scope.orderByArr = scope.orderBy.split(' '); //eg. ['updatedOn', 'DESC']

                // if current order by and column name is match then set scope.by and scope.reverse
                if (scope.columnName === scope.orderByArr[0]) {
                    scope.by = scope.columnName;

                    if (scope.orderByArr[0] === 'ASC') {
                        scope.reverse = false;
                    } else if (scope.orderByArr[1] === 'DESC') {  //DESC means reverse, ASC means not reverse
                        scope.reverse = true;
                    }
                }
            }

            scope.handleClick = function() {
                let orderBy = [];
                if (scope.columnName === scope.by) {
                    scope.reverse = !scope.reverse;
                } else {
                    // Sort descending
                    scope.reverse = false;
                    scope.by = scope.columnName;
                }

                if (scope.reverse) {
                    orderBy[0] = scope.columnName;
                    orderBy[1] = 'DESC';
                } else {
                    orderBy[0] = scope.columnName;
                    orderBy[1] = 'ASC';
                }

                scope.onClickSort({
                    options: {
                        orderBy: orderBy.join(' ')
                    }
                });
            };
        }
    }
});