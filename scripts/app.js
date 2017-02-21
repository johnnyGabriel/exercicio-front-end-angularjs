angular.module('DashboardApp', ['angular-chartist'])

    .controller('Dashboard', function($scope, $http) {

        const PENDING = 1
        const LOST = 2
        const MAINTAINED = 8
        const CONQUERED = 9 

        function getSubsGroups( data ) {

            return data['data']['result']['children']

        }

        function groupById( groups, id ) {

            function filter(id) {

                return groups.filter(function( item ) {

                    return item.group.id == id

                })

            }

            return arguments.length == 1 ? filter : filter( id )

        }

        function chartGroupPayType( group ) {

            var initialValue = {
                labels: [],
                series: [[]]
            }

            return group.children.reduce(function(acc, payType) {

                acc['labels'].push( payType.group.name )
                acc['series'][0].push( payType.subscriberCount )
                return acc

            }, initialValue)

        }

        function chartGroupsPayType( groups ) {

            return groups.reduce(function(acc, group) {

                acc[ group.group.id ] = chartGroupPayType( group )
                return acc

            }, [])

        }

        function chartGroups( groups ) {

            var initialValue = { labels: [], series: [[]] }

            return groups.reduce(function(acc, group) {

                acc['labels'].push( group.group.name )
                acc['series'][0].push( group.subscriberCount )
                return acc

            }, initialValue)

        }

        $http.get('http://localhost:8080/data/example-data.js')
            .then( getSubsGroups )
            .then(function( groups ) {

                var payTypesChartData = chartGroupsPayType( groups )
                var groupsChartData = chartGroups( groups )

                $scope.groupsSubsChart = groupsChartData

                $scope.lostSubsChart = payTypesChartData[ LOST ]
                $scope.maintainedSubsChart = payTypesChartData[ MAINTAINED ]
                $scope.conqueredSubsChart = payTypesChartData[ CONQUERED ]

                return [ payTypesChartData, groupsChartData ]

            })
            .then( console.log )
            .catch( err => console.log('ERR', err) )

    })