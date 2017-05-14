  //Angular Starter App

var main = angular.module("admin", ['ui.router','ngRoute','ngResource','ngLetterAvatar'])
.run(function($http,$rootScope,$location)
{
    //defining global veriables
    $rootScope.roles = [{
          name: "Administrator",
          code: 0
       }, {
          name: "Staff",
          code: 1
       }, {
          name: "General",
          code: 2
    }];


    //Checking current session value
    if(sessionStorage.length > 0)
    {
        $rootScope.current_admin = sessionStorage.current_admin;
        $rootScope.current_role = sessionStorage.current_role;
        $rootScope.current_mail = sessionStorage.current_mail;
        $rootScope.sess = sessionStorage.sess;
        //check role user
        if($rootScope.current_role=='admin')
        {
            $rootScope.auth = false;
        } else
            {
                 $rootScope.auth = true;
            }
    } else
        {
            $rootScope.auth = true;
            $rootScope.current_admin = 'Guest';
        }

    $rootScope.signout = function(){

        $rootScope.auth = true;
        $rootScope.current_admin = 'Guest';
        $rootScope.current_role = 'Guest';
        sessionStorage.clear();
        $location.path('/');
    };
});

//Routing Configuration (define routes)
main.config([
    '$stateProvider', '$urlRouterProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider,$rootScope) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    '': { templateUrl: 'dashboard.html' },
                    'signin': { templateUrl:  'signin.html'}
                },
                // templateUrl: 'dashboard.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('subject', {
                url: '/subject',
                templateUrl: 'subject.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('editSubject', {
                url: '/editSubject/info?subjectId',
                templateUrl: 'editSubject.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('editCategorySubject', {
                url: '/editCategorySubject/info?categorySubId',
                templateUrl: 'loaimon/editCategorySubject.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('addSubject', {
                url: '/addSubject',
                templateUrl: 'addSubject.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'contact-admin.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('feedback', {
                url: '/feedback',
                templateUrl: 'feedback.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('removeSubject', {//delete subject
                url: '/removeSubject',
                templateUrl: 'subject.html',//return page
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('manageAccount', {
                url: '/manageAccount',
                templateUrl: 'manageAccount.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('yeucauhoc', {
                url: '/yeucauhoc',
                templateUrl: 'yeucauhoc.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('categorySubject', {
                url: '/categorySubject',
                templateUrl: 'loaimon/categorySubject.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('addCategorySubject', {
                url: '/addCategorySubject',
                templateUrl: 'loaimon/addCategorySubject.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'profile.html',
                caseInsensitiveMatch: true,
                controller: 'AdminController'
            })
    }
]);
