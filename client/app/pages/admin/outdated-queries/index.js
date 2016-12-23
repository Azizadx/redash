import moment from 'moment';
import template from './outdated-queries.html';

function OutdatedQueriesCtrl($scope, NgTableParams, currentUser, Events, $http, $timeout) {
  Events.record('view', 'page', 'admin/outdated_queries');
  $scope.autoUpdate = true;

  this.tableParams = new NgTableParams({ count: 50 }, {});

  const refresh = () => {
    if ($scope.autoUpdate) {
      $scope.refresh_time = moment().add(1, 'minutes');
      $http.get('/api/admin/queries/outdated').success((data) => {
        this.tableParams.settings({
          dataset: data.queries,
        });
        $scope.updatedAt = data.updated_at * 1000.0;
      });
    }

    const timer = $timeout(refresh, 59 * 1000);

    $scope.$on('$destroy', () => {
      if (timer) {
        $timeout.cancel(timer);
      }
    });
  };

  refresh();
}

export default function (ngModule) {
  ngModule.component('outdatedQueriesPage', {
    template,
    controller: OutdatedQueriesCtrl,
  });

  return {
    '/admin/queries/outdated': {
      template: '<outdated-queries-page></outdated-queries-page>',
      title: 'Outdated Queries',
    },
  };
}