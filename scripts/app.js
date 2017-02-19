angular.module('DashboardApp', [])

    .controller('Dashboard', function($scope, $http) {

        const SUBS_STATUS = {
            PENDING: 1,
            LOST: 2,
            MAINTAINED: 8,
            CONQUERED: 9
        }

        $scope.msg = "lorem ipsum"

        function getSubsStatus( data ) {

            return data['data']['result']['children']

        }

        function statusById( status ) {

            return function( id ) {

                return status.filter(function( item ) {

                    return item.group.id == id

                })[0]

            }

        }

        function formatToCount( status ) {

            var initialValue = {}

            initialValue[ status.group.name ] = {
                _total: status.subscriberCount
            }

            return status.children.reduce(function(acc, el) {

                acc[ status.group.name ][ el.group.name ] = el.subscriberCount
                return acc

            }, initialValue)

        }

        $http.get('http://localhost:8080/data/example-data.js')
            .then(function( res ) {

                var groups = getSubsStatus( res )

                var byId = statusById( groups )

                var status = [
                    byId( SUBS_STATUS['MAINTAINED'] ),
                    byId( SUBS_STATUS['CONQUERED'] )
                ]

                return status.map( formatToCount )

            })
            .then( console.log )
            .catch( err => console.log('ERR', err) )

    })