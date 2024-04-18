const trackPageView = (page, websiteId) => {
  sendStatsData({ name: 'pageview', page, websiteId });
};

const trackCustomEvent = (name, page, websiteId) => {
  sendStatsData({ name, page, websiteId });
};

const sendStatsData = (data) => {
  fetch('API_URL/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
