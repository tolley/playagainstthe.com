// This file contains imports for each of the individual main content
// areas on the dashboard.  Each of these must be a method which will
// return the results of a call to the jsx method and then be turned
// into a DOM tree and put into the DOM in the dashboard_content element.

// Define our routes for the internal dashboard pieces. 
// The methods are defined in js/dashboard_views/
// and included in dashboard.ejs (script tags)
const DashboardRoutes = {
    '/home': Home,
    '/game': Game, // View a game, will only have links to games you own
    '/play': Play, // Join the queue and play as against the collective
};

const DashboardOnLoads = {
    '/game': gameJSLoad,
    '/play': playJSLoad
};
