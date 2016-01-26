(function() {
    'use strict';
    angular.module('app', ['ui.router', 'ngMaterial'])
        .config(Config);

    function Config($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
            .state('Home', {
                url: '/',
                templateUrl: 'views/Home.html'
            })
            .state('AddRecipe', {
                url: '/addrecipe/:id',
                templateUrl: 'views/AddRecipe.html'
            })
            .state('EditRecipe', {
                url: '/editrecipe/:id',
                templateUrl: 'views/EditRecipe.html'
            })
            .state('AddCommunity', {
                url: '/addcommunity',
                templateUrl: 'views/AddCommunity.html'
            })
            .state('ViewCommunity', {
                url: '/viewcommunity/:id',
                templateUrl: 'views/ViewCommunity.html'
            })
            .state('RegLog', {
                url: '/reglog',
                templateUrl: 'views/RegLog.html'
            })
            .state('Profile', {
                url: '/profile/:id',
                templateUrl: 'views/profile.html',
            });
        $urlRouterProvider.otherwise('/');
        $httpProvider.interceptors.push('AuthInterceptor');

    }
})();

(function() {
    'use strict';
    angular.module('app')
        .controller('AddCommunityController', AddCommunityController);


    function AddCommunityController(CommunityFactory, $state) {
        var vm = this;
        vm.community = {};

        vm.addCommunity = function() {
            CommunityFactory.addCommunity(vm.community).then(function(res) {
                console.log(vm.community);
                $state.go('Home');
            });
        };

        vm.colors = ['#f5f5f5', '#b9f6ca', '#ff80ab', '#ffff8d', '#84ffff', '#80d8ff', '#448aff', '#b388ff', '#8c9eff', '#ff8a80'];

        vm.icons = ["zmdi zmdi-drink", "zmdi zmdi-cocktail", "zmdi zmdi-cutlery", "zmdi zmdi-eyedropper", "zmdi zmdi-fire", "zmdi zmdi-flash", "zmdi zmdi-mood-bad", "zmdi zmdi-mood"];
        //star <i class="zmdi zmdi-star"></i>


    }
})();

(function() {
    'use strict';
    angular.module('app')
        .controller('AddRecipeController', AddRecipeController);

    function AddRecipeController(HomeFactory, $state, $stateParams) {
        var vm = this;
        vm.recipe = {};
        vm.recipe.ingredients = [];
        // vm.recipe.community = {};

        vm.createRecipe = function() {
            HomeFactory.postRecipe(vm.recipe, $stateParams.id).then(function(res) {
                $state.go('ViewCommunity', {
                    id: $stateParams.id
                });
            }, function(res) {
                vm.recipe = res;
            });
        };

        vm.goToViewCom = function() {
            $state.go('ViewCommunity', {
                id: $stateParams.id
            });
        };

        vm.colors = ['#f5f5f5', '#b9f6ca', '#ff80ab', '#ffff8d', '#84ffff', '#80d8ff', '#448aff', '#b388ff', '#8c9eff', '#ff8a80'];

    }
})();

(function() {
    'use strict';
    angular.module('app')
        .controller('EditRecipeController', EditRecipeController);


    function EditRecipeController(CommunityFactory, $stateParams, $state) {
        var vm = this;
        vm.editRecipe = {};
        vm.editRecipe.ingredients = [];

        if ($stateParams.id) {
            CommunityFactory.getOneRecipeToEdit($stateParams.id).then(function(res) {
                vm.editRecipe = res;
            });
        }

        vm.updateRecipe = function(edittedRecipe) {
            console.log(edittedRecipe);
            CommunityFactory.updateRecipe({
                recipeEditted: edittedRecipe
            }).then(function(res) {
                $state.go('ViewCommunity', {
                    id: edittedRecipe.community
                }, {
                    location: true
                });
            });
        };

        vm.goToViewComFromEdit = function(x) {
            $state.go('ViewCommunity', {
                id: x.community
            }, {
                location: true
            });
        };


    }
})();

(function() {
    'use strict';
    angular.module('app')
        .controller('GlobalController', GlobalController);

    function GlobalController(UserFactory, $state) {
        var vm = this;
        vm.isLogin = true;
        vm.user = {};
        vm.status = UserFactory.status;

        vm.logout = function() {
            UserFactory.logout();
            $state.go('Home');
        };

        vm.register = function() {
            UserFactory.register(vm.user).then(function() {
                $state.go('Home');
            });
        };

        vm.login = function() {
            UserFactory.login(vm.user).then(function() {
                $state.go('Home');
            });
        };

    }
})();

(function() {
    'use strict';
    angular.module('app')
        .controller('HomeController', HomeController);


    function HomeController(HomeFactory, $state) {
        var vm = this;
        // vm.coms = {};

        HomeFactory.getAllCom().then(function(res) {
            //console.log(res)
            vm.communities = res;
        });

        vm.goToCom = function(xid) {
            HomeFactory.goToCom(xid).then(function(res) {
                $state.go('ViewCommunity', {
                    id: xid
                });
            });
        };


    }
})();

(function() {
    "use strict";
    angular.module('app')
        .controller('ProfileController', ProfileController);

    function ProfileController($stateParams, UserFactory) {
        var vm = this;
        vm.status = UserFactory.status;




        UserFactory.getAllByUser(vm.status._id).then(function(res) {
            vm.recipearray = res;
            console.log(vm.recipearray);
            console.log(vm.recipearray.communities);
            console.log(vm.recipearray.recipes);

        });


    }
})();

(function() {
    'use strict';
    angular.module('app')
        .controller('ViewCommunityController', ViewCommunityController);


    function ViewCommunityController(CommunityFactory, UserFactory, $stateParams, $state) {
        var vm = this;
        vm.status = UserFactory.status;


        if ($stateParams.id) {
            CommunityFactory.getAllRecipes($stateParams.id).then(function(res) {
                // if($stateParams.id == res[i].community){
                vm.recipes = res;
                // 	}
            });
        }

        vm.deleteRecipe = function(recipe) {
            CommunityFactory.deleteRecipe(recipe._id).then(function() {
                vm.recipes.splice(vm.recipes.indexOf(recipe), 1);
            });
        };

        vm.goToAddRecipe = function() {
            if (!vm.status.username) {
                alert("You Must Be Logged In To Add Recipe!");
                $state.go('RegLog');
            } else {
                $state.go('AddRecipe', {
                    id: $stateParams.id
                });
            }
        };

        if ($stateParams.id) {
            CommunityFactory.getSingleCom($stateParams.id).then(function(res) {
                // console.log(res)
                vm.communities = res;
            });
        }

        vm.deleteCommunity = function() {
            // console.log({id:$stateParams.id});
            var response = confirm("Are You Sure You'd Like To Delete?");
            if (response) {
                CommunityFactory.deleteCommunity({
                    id: $stateParams.id
                }).then(function() {
                    // vm.communities.splice(vm.communities.indexOf(id), 1);
                    $state.go('Home');
                });
            } else {
                // console.log('ViewCommunity', {id:$stateParams.id})
                $state.go('ViewCommunity', {
                    id: $stateParams.id
                });
            }
        };



        vm.editRecipe = function(id) {
            console.log(id, 2);
            $state.go('EditRecipe', {
                id: id
            });
        };


        vm.getCopy = function(com) {
            return angular.copy(com);
        };

        vm.editCom = function(com) {
            // console.log(com)
            CommunityFactory.editCom(com, {
                id: $stateParams.id
            }).then(function(res) {
                vm.editedCom = null;
                vm.communities.name = com.name;
            });
        };
    }
})();

(function() {
    "use strict";
    angular.module('app')
        .factory('AuthInterceptor', AuthInterceptor);

    function AuthInterceptor($window) {
        var o = {
            request: function(config) {
                if ($window.localStorage.getItem('token')) {
                    config.headers.authorization = "Bearer " + $window.localStorage.getItem('token');
                }
                return config;
            }
        };

        return o;
    }
})();

(function() {

    'use strict';
    angular.module('app')
        .factory('CommunityFactory', CommunityFactory);


    function CommunityFactory($http, $q) {
        var o = {};

        o.addCommunity = function(com) {
            var q = $q.defer();
            $http.post('/api/community', com).then(function(res) {
                //console.log(res);
                q.resolve(res.data);
            });
            return q.promise;
        };


        o.getAllRecipes = function(id) {
            var q = $q.defer();
            $http.get('/api/recipe/' + id).then(function(res) {
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.deleteRecipe = function(id) {
            var q = $q.defer();
            $http.delete('/api/recipe/' + id).then(function(res) {
                q.resolve();
            });
            return q.promise;
        };

        o.editCom = function(com, id) {
            var q = $q.defer();
            console.log(com);
            console.log(id.id);
            $http.put('/api/community/' + id.id, com).then(function(res) {
                q.resolve(res.data);
            });
            return q.promise;
        };


        o.getOneRecipeToEdit = function(id) {
            console.log(id);
            var q = $q.defer();
            $http.get('/api/recipe/edit/' + id).then(function(res) {
                console.log(res);
                q.resolve(res.data);
                // console.log(res.data);

            });
            return q.promise;
        };

        o.updateRecipe = function(recipeObj) {
            console.log(recipeObj);

            var q = $q.defer();
            $http.put('/api/recipe', recipeObj).then(function(res) {
                q.resolve(res.data);
            });
            return q.promise;
        };


        o.getSingleCom = function(id) {
            var q = $q.defer();
            $http.get('/api/community/' + id).then(function(res) {
                // console.log(res)
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.deleteCommunity = function(id) {
            // console.log(id.id)
            var q = $q.defer();
            $http.delete('/api/community/' + id.id).then(function(res) {
                q.resolve();
            });
            return q.promise;
        };

        return o;
    }

})();

(function() {
    'use strict';
    angular.module('app')
        .factory('HomeFactory', HomeFactory);

    function HomeFactory($http, $q) {
        var o = {};


        o.postRecipe = function(recipe, comID) { //second param = comID
            var q = $q.defer();
            var i = 0;
            while (i < recipe.ingredients.length) {
                if (!recipe.ingredients[i]) {
                    recipe.ingredients.splice(i, 1);
                } else {
                    i++;
                }
            }
            if (recipe.ingredients.length < 1) {
                q.reject(recipe);
            } else {
                $http.post('/api/recipe/' + comID, recipe).then(function(res) {
                    // console.log(res)
                    q.resolve(res);
                });
            }
            return q.promise;
        };


        o.getAllCom = function() {
            var q = $q.defer();
            $http.get('/api/community').then(function(res) {
                //console.log(res)
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.goToCom = function(xid) {
            var q = $q.defer();
            $http.get('/api/community/' + xid).then(function(res) {
                //console.log(res)
                q.resolve(res.data);
            });
            return q.promise;
        };



        return o;
    }
})();

(function() {
    'use strict';
    angular.module('app')
        .factory('UserFactory', UserFactory);

    function UserFactory($http, $q) {
        var o = {};
        o.status = {};

        o.register = function(user) {
            var q = $q.defer();
            $http.post('/api/users/register', user).then(function(res) {
                setToken(res.data);
                setUser();
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.login = function(user) {
            var q = $q.defer();
            $http.post('/api/users/login', user).then(function(res) {
                setToken(res.data);
                setUser();
                q.resolve(res.data);
            });
            return q.promise;
        };

        o.logout = function() {
            removeToken();
            removeUser();
        };

        function setUser() {
            var user = JSON.parse(urlBase64Decode(getToken().split('.')[1]));
            o.status.username = user.username;
            o.status._id = user._id;
        }

        function removeUser() {
            o.status.username = null;
            o.status._id = null;
        }

        function getToken() {
            return localStorage.getItem('token');
        }

        function setToken(token) {
            return localStorage.setItem('token', token);
        }

        function removeToken() {
            return localStorage.removeItem('token');
        }

        function urlBase64Decode(str) {
            var output = str.replace(/-/g, '+').replace(/_/g, '/');
            switch (output.length % 4) {
                case 0:
                    {
                        break;
                    }
                case 2:
                    {
                        output += '==';
                        break;
                    }
                case 3:
                    {
                        output += '=';
                        break;
                    }
                default:
                    {
                        throw 'Illegal base64url string!';
                    }
            }
            return decodeURIComponent(escape(window.atob(output))); //polifyll https://github.com/davidchambers/Base64.js
        }

        if (getToken()) setUser();

        o.getAllByUser = function(id) {
            console.log("here");
            var q = $q.defer();
            $http.get('/api/users/profile/' + id).then(function(res) {
                console.log(res);
                q.resolve(res.data);
            });
            return q.promise;
        };

        return o;
    }
})();
