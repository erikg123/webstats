window.trackPageView = (page, projectId) => {
  sendStatsData({ name: 'pageview', page, projectId });
};

window.trackCustomEvent = (name, page, projectId) => {
  sendStatsData({ name, page, projectId });
};

const sendStatsData = (data) => {
  fetch('https://83.249.98.222/api/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
