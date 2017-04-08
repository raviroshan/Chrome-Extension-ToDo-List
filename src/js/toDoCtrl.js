app.controller("ToDoCtrl", function($scope, $filter) {
    $scope.contenteditable = true;
    $scope.todos = [];
    getToDoList();

    $scope.getTotalTodos = function() {
        return $filter('filter')($scope.todos, {
            done: '!true'
        }).length;
    }

    $scope.clearCompleted = function() {
        $scope.todos = $filter('filter')($scope.todos, {
            done: '!true'
        });
    }

    $scope.addToDo = function() {
        if ($scope.formTodoText) { // Checked for NULL To-Do Entry by user input
            $scope.todos.push({
                text: $scope.formTodoText,
                done: false
            });
            $scope.formTodoText = '';
        };
    }

    $scope.deleteCurrent = function(item) {
        var index = $scope.todos.indexOf(item)
        $scope.todos.splice(index, 1);
    }

    $scope.toogleContenteditable = function(event) {
        event.target.setAttribute("contenteditable", $scope.contenteditable);
        $scope.contenteditable = !$scope.contenteditable;
    }

    $scope.key = function($event) {
        if ($event.keyCode == 13) {
            event.target.setAttribute("contenteditable", $scope.contenteditable);
        }
    }

    function saveToDoList() {
        chrome.storage.sync.set({
            toDoList: angular.toJson($scope.todos)
        });
        console.log('toDoList Saved in Cloud', $scope.todos);
    }

    $scope.$watch('todos', function(value) {
        console.log('toDoList changed', $scope.todos);
        saveToDoList();
    }, true);

    function getToDoList() {
        /*Retrive the To-Do List from Chrome API Storage*/
        console.log('Function getToDoList');
        var previousToDoList = null;
        chrome.storage.sync.get("toDoList", function(obj) {
            previousToDoList = obj.toDoList;
            console.log('Original toDoList Fecthed from Cloud : ', previousToDoList);
            if (previousToDoList == null || previousToDoList == "null") {
                previousToDoList = [];
            } else {
                previousToDoList = angular.fromJson(previousToDoList);
            }
            console.log('Modified toDoList Fecthed from Cloud : ', previousToDoList);
            $scope.todos = previousToDoList;
            $scope.$apply();
        });
    }
});
